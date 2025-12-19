import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

function addDays(d, days){
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function toISODate(d){
  const x = new Date(d);
  const yyyy=x.getFullYear();
  const mm=String(x.getMonth()+1).padStart(2,'0');
  const dd=String(x.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

async function maybeCreateImmunNotif(pool, {recipientId, scheduleId, title, message, level}){
  if(!recipientId || !scheduleId) return;
  // Dedup: kalau notifikasi untuk schedule ini sudah dibuat dalam 7 hari terakhir, skip
  const [[ex]] = await pool.execute(
    "SELECT id FROM notifications WHERE recipient_id=? AND related_type='IMMUNIZATION' AND related_id=? AND created_at > (NOW() - INTERVAL 7 DAY) LIMIT 1",
    [recipientId, scheduleId]
  );
  if(ex) return;
  await pool.execute(
    "INSERT INTO notifications (recipient_id,title,message,level,related_type,related_id) VALUES (?,?,?,?,?,?)",
    [recipientId, title, message, level||'WARNING', 'IMMUNIZATION', scheduleId]
  );
}

export default function immunizationRoutes(pool){
  const r=express.Router();

  // Catat imunisasi (pegawai)
  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {child_id,vaccine,given_at,notes,vaccine_type_id,schedule_id}=req.body||{};
      if(!child_id || !given_at) return res.status(400).json({message:"child_id & given_at wajib"});

      let vaccineName = vaccine;
      let vTypeId = vaccine_type_id || null;
      let schedId = schedule_id || null;

      // Jika tidak kirim vaccine (free text), coba derive dari schedule
      if((!vaccineName || !String(vaccineName).trim()) && schedId){
        const [[row]] = await pool.execute(
          `SELECT vt.name AS vname, vs.dose_label AS dose, vt.id AS vtid
           FROM vaccine_schedules vs
           JOIN vaccine_types vt ON vt.id=vs.vaccine_type_id
           WHERE vs.id=? LIMIT 1`,
          [Number(schedId)]
        );
        if(row){
          vaccineName = `${row.vname} - ${row.dose}`;
          vTypeId = vTypeId || row.vtid;
        }
      }

      if(!vaccineName || !String(vaccineName).trim()){
        return res.status(400).json({message:"vaccine wajib (atau isi schedule_id)"});
      }

      const [result]=await pool.execute(
        "INSERT INTO immunizations (child_id,recorded_by,vaccine,vaccine_type_id,schedule_id,given_at,notes) VALUES (?,?,?,?,?,?,?)",
        [Number(child_id), req.userId, vaccineName, vTypeId?Number(vTypeId):null, schedId?Number(schedId):null, given_at, notes||null]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // List riwayat imunisasi per balita
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const child_id=Number(req.query.child_id);
      if(!child_id) return res.status(400).json({message:"child_id query wajib"});

      const role = req.header("x-user-role");
      if(role === "MASYARAKAT"){
        const [[c]] = await pool.execute("SELECT parent_id FROM children WHERE id=? LIMIT 1", [child_id]);
        if(!c || Number(c.parent_id||0) !== Number(req.userId)) return res.status(403).json({message:"Forbidden"});
      }

      const [rows]=await pool.execute(
        "SELECT * FROM immunizations WHERE child_id=? ORDER BY given_at DESC",
        [child_id]
      );
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // Jadwal imunisasi + status (jatuh tempo) + auto-notification
  r.get("/schedule", requireAuth, async (req,res)=>{
    try{
      const child_id=Number(req.query.child_id);
      if(!child_id) return res.status(400).json({message:"child_id query wajib"});

      const [[child]] = await pool.execute(
        "SELECT id,name,birth_date,parent_id,created_by FROM children WHERE id=? LIMIT 1",
        [child_id]
      );
      if(!child) return res.status(404).json({message:"Balita tidak ditemukan"});

      const role = req.header("x-user-role");
      if(role === "MASYARAKAT" && Number(child.parent_id||0) !== Number(req.userId)){
        return res.status(403).json({message:"Forbidden"});
      }

      if(!child.birth_date) return res.status(400).json({message:"Tanggal lahir balita belum diisi"});

      const [schedules] = await pool.execute(
        `SELECT vs.id AS schedule_id, vs.vaccine_type_id, vt.name AS vaccine_name, vt.code, vs.dose_label,
                vs.recommended_age_weeks
         FROM vaccine_schedules vs
         JOIN vaccine_types vt ON vt.id=vs.vaccine_type_id
         WHERE vt.mandatory=1
         ORDER BY vs.recommended_age_weeks ASC, vs.id ASC`
      );

      const [given] = await pool.execute(
        "SELECT schedule_id, vaccine_type_id, given_at FROM immunizations WHERE child_id=?",
        [child_id]
      );
      const doneBySchedule = new Map();
      for(const g of given){
        if(g.schedule_id!=null && !doneBySchedule.has(g.schedule_id)) doneBySchedule.set(g.schedule_id, g);
      }

      const today = new Date();
      const results=[];
      for(const s of schedules){
        const dueDate = addDays(child.birth_date, Number(s.recommended_age_weeks||0)*7);
        const dueISO = toISODate(dueDate);
        const done = doneBySchedule.get(s.schedule_id) || null;

        let status = "UPCOMING";
        let level = "INFO";
        if(done){
          status = "DONE";
        } else {
          const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000*60*60*24));
          if(diffDays <= 0){
            status = "DUE";
            level = "WARNING";
            if(diffDays <= -30){
              status = "OVERDUE";
              level = "DANGER";
            }
          } else if(diffDays <= 14){
            status = "SOON";
            level = "WARNING";
          }

          // Create notification when DUE / OVERDUE (dedup 7 hari)
          if(status === "DUE" || status === "OVERDUE"){
            const title = "Pengingat Imunisasi";
            const msg = `${child.name}: ${s.vaccine_name} (${s.dose_label}) ${status === 'OVERDUE' ? 'TERLAMBAT' : 'JATUH TEMPO'} (jatuh tempo ${dueISO}).`;
            const recipients = new Set();
            if(child.parent_id) recipients.add(Number(child.parent_id));
            if(child.created_by) recipients.add(Number(child.created_by));
            for(const rid of recipients){
              await maybeCreateImmunNotif(pool, {recipientId: rid, scheduleId: s.schedule_id, title, message: msg, level});
            }
          }
        }

        results.push({
          schedule_id: s.schedule_id,
          vaccine_type_id: s.vaccine_type_id,
          vaccine_name: s.vaccine_name,
          code: s.code,
          dose_label: s.dose_label,
          recommended_age_weeks: s.recommended_age_weeks,
          due_date: dueISO,
          status,
          level,
          done_at: done?.given_at || null
        });
      }

      res.json({ child_id: child.id, child_name: child.name, birth_date: child.birth_date, schedule: results });
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
