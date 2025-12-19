import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

function parseBloodPressure(bp){
  if(!bp || typeof bp !== "string") return null;
  const m = bp.trim().match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if(!m) return null;
  const sys=Number(m[1]);
  const dia=Number(m[2]);
  if(!Number.isFinite(sys)||!Number.isFinite(dia)) return null;
  return {sys,dia};
}

// Simple height-for-age "suspected stunting" threshold (approx) using anchor medians + linear interpolation.
// Ini hanya peringatan dini untuk demo, bukan diagnosis.
function isSuspectedStunting({ageMonths, sex, heightCm}){
  if(!Number.isFinite(ageMonths) || ageMonths<0 || ageMonths>60) return false;
  if(!Number.isFinite(heightCm)) return false;
  const anchors = sex==="P" ? [
    {m:0, h:49.1},{m:6,h:65.7},{m:12,h:74.0},{m:24,h:86.4},{m:36,h:95.1},{m:48,h:102.7},{m:60,h:109.4}
  ] : [
    {m:0, h:49.9},{m:6,h:67.6},{m:12,h:75.7},{m:24,h:87.8},{m:36,h:96.1},{m:48,h:103.3},{m:60,h:110.0}
  ];
  let i=0;
  while(i<anchors.length-1 && ageMonths>anchors[i+1].m) i++;
  const a=anchors[i];
  const b=anchors[Math.min(i+1, anchors.length-1)];
  const t = (b.m===a.m) ? 0 : (ageMonths-a.m)/(b.m-a.m);
  const median = a.h + (b.h-a.h)*t;
  const threshold = median - 6.0;
  return heightCm < threshold;
}

async function createNotification(pool, recipientId, title, message, level, relatedId){
  if(!recipientId) return;
  await pool.execute(
    "INSERT INTO notifications (recipient_id,title,message,level,related_type,related_id) VALUES (?,?,?,?,?,?)",
    [recipientId, title, message, level||"WARNING", "MEASUREMENT", relatedId||null]
  );
}

function classifyAbnormalities({person_type, blood_pressure, blood_sugar, cholesterol, height_cm, childMeta}){
  const issues=[];

  // Blood pressure
  const parsed=parseBloodPressure(blood_pressure);
  if(parsed){
    const {sys,dia}=parsed;
    const high = sys>=140 || dia>=90;
    const low = sys<90 || dia<60;
    if(high) issues.push({kind:"BP_HIGH", label:`Tekanan darah tinggi (${sys}/${dia})`, level:"DANGER"});
    if(low) issues.push({kind:"BP_LOW", label:`Tekanan darah rendah (${sys}/${dia})`, level:"WARNING"});
  }

  // Blood sugar (mg/dL) demo thresholds
  if(blood_sugar!=null && Number.isFinite(Number(blood_sugar))){
    const g=Number(blood_sugar);
    // Untuk demo: <70 rendah, >=200 tinggi
    if(g < 70) issues.push({kind:"GLU_LOW", label:`Gula darah rendah (${g})`, level:"WARNING"});
    if(g >= 200) issues.push({kind:"GLU_HIGH", label:`Gula darah tinggi (${g})`, level:"DANGER"});
  }

  // Cholesterol (mg/dL) demo thresholds
  if(cholesterol!=null && Number.isFinite(Number(cholesterol))){
    const c=Number(cholesterol);
    if(c >= 240) issues.push({kind:"CHOL_HIGH", label:`Kolesterol tinggi (${c})`, level:"DANGER"});
    else if(c >= 200) issues.push({kind:"CHOL_BORDER", label:`Kolesterol borderline (${c})`, level:"WARNING"});
  }

  // Stunting (child)
  if(person_type==="CHILD" && childMeta?.birth_date && height_cm!=null){
    const birth=new Date(childMeta.birth_date);
    const now=new Date();
    const ageMonths = Math.max(0, (now.getFullYear()-birth.getFullYear())*12 + (now.getMonth()-birth.getMonth()) - (now.getDate()<birth.getDate()?1:0));
    if(isSuspectedStunting({ageMonths, sex: childMeta.sex||"L", heightCm:Number(height_cm)})){
      issues.push({kind:"STUNTING", label:`Terindikasi stunting (TB ${height_cm} cm, usia ~${ageMonths} bln)`, level:"WARNING"});
    }
  }

  return issues;
}

export default function measurementRoutes(pool){
  const r=express.Router();

  // Pegawai: input pemeriksaan (balita/ibu hamil/lansia)
  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {person_type,person_id,weight_kg,height_cm,blood_pressure,blood_sugar,cholesterol,notes}=req.body||{};
      if(!person_type||!person_id) return res.status(400).json({message:"person_type & person_id wajib"});

      const [result]=await pool.execute(
        "INSERT INTO measurements (person_type,person_id,recorded_by,weight_kg,height_cm,blood_pressure,blood_sugar,cholesterol,notes) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          person_type,
          Number(person_id),
          req.userId,
          weight_kg==null?null:Number(weight_kg),
          height_cm==null?null:Number(height_cm),
          blood_pressure||null,
          blood_sugar==null?null:Number(blood_sugar),
          cholesterol==null?null:Number(cholesterol),
          notes||null,
        ]
      );

      // Evaluate anomalies & create notifications (do not block save)
      try{
        let person=null;
        if(person_type==="CHILD"){
          const [[row]] = await pool.execute(
            "SELECT id,name,birth_date,sex,parent_id,created_by FROM children WHERE id=?",
            [Number(person_id)]
          );
          person=row||null;
        } else if(person_type==="PREGNANT"){
          const [[row]] = await pool.execute(
            "SELECT id,name,user_id,created_by FROM pregnant_mothers WHERE id=?",
            [Number(person_id)]
          );
          person=row||null;
        } else if(person_type==="ELDERLY"){
          const [[row]] = await pool.execute(
            "SELECT id,name,user_id,created_by FROM elderly WHERE id=?",
            [Number(person_id)]
          );
          person=row||null;
        }

        if(person){
          const issues = classifyAbnormalities({
            person_type,
            blood_pressure,
            blood_sugar,
            cholesterol,
            height_cm: height_cm==null?null:Number(height_cm),
            childMeta: person_type==="CHILD" ? person : null
          });

          if(issues.length){
            const who = person.name ? `${person.name}` : `${person_type} #${person_id}`;
            const title = "Notifikasi Kesehatan";
            const msg = `${who}: ${issues.map(x=>x.label).join("; ")}. Mohon tindak lanjuti.`;
            const level = issues.some(x=>x.level==="DANGER") ? "DANGER" : "WARNING";

            const recipients = new Set();
            if(person.created_by) recipients.add(Number(person.created_by));
            if(person_type==="CHILD" && person.parent_id) recipients.add(Number(person.parent_id));
            if(person_type!=="CHILD" && person.user_id) recipients.add(Number(person.user_id));

            for(const rid of recipients){
              await createNotification(pool, rid, title, msg, level, result.insertId);
            }
          }
        }
      } catch(_e){ /* ignore */ }

      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // Riwayat pemeriksaan
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const {person_type,person_id}=req.query;
      if(!person_type||!person_id) return res.status(400).json({message:"person_type & person_id query wajib"});

      // Access control sederhana: masyarakat hanya boleh lihat data miliknya
      const role = req.header("x-user-role");
      if(role === "MASYARAKAT"){
        const pid = Number(person_id);
        if(person_type === "CHILD"){
          const [[c]] = await pool.execute("SELECT parent_id FROM children WHERE id=? LIMIT 1", [pid]);
          if(!c || Number(c.parent_id||0) !== Number(req.userId)) return res.status(403).json({message:"Forbidden"});
        } else if(person_type === "PREGNANT"){
          const [[p]] = await pool.execute("SELECT user_id FROM pregnant_mothers WHERE id=? LIMIT 1", [pid]);
          if(!p || Number(p.user_id||0) !== Number(req.userId)) return res.status(403).json({message:"Forbidden"});
        } else if(person_type === "ELDERLY"){
          const [[e]] = await pool.execute("SELECT user_id FROM elderly WHERE id=? LIMIT 1", [pid]);
          if(!e || Number(e.user_id||0) !== Number(req.userId)) return res.status(403).json({message:"Forbidden"});
        }
      }

      const [rows]=await pool.execute(
        "SELECT * FROM measurements WHERE person_type=? AND person_id=? ORDER BY recorded_at DESC",
        [String(person_type), Number(person_id)]
      );
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
