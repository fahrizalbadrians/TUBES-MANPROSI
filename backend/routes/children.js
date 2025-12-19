import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

async function resolveParentId(pool, { parent_id, parent_email }){
  if(parent_id) return Number(parent_id);
  if(parent_email){
    const [[u]] = await pool.execute(
      "SELECT id, role FROM users WHERE email=? LIMIT 1",
      [parent_email]
    );
    if(!u) throw new Error("Akun masyarakat (email orang tua) tidak ditemukan");
    if(u.role !== "MASYARAKAT") throw new Error("Email orang tua harus akun Masyarakat");
    return Number(u.id);
  }
  return null;
}

export default function childrenRoutes(pool){
  const r=express.Router();

  // Pegawai: tambah data balita (opsional: link ke akun orang tua via parent_id / parent_email)
  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {name,nik,birth_date,address,sex,parent_id,parent_email}=req.body||{};
      if(!name) return res.status(400).json({message:"name wajib"});

      let pid=null;
      try{
        pid = await resolveParentId(pool, { parent_id, parent_email });
      }catch(e){
        return res.status(400).json({message:e.message});
      }

      const [result]=await pool.execute(
        "INSERT INTO children (created_by,parent_id,name,nik,birth_date,address,sex) VALUES (?,?,?,?,?,?,?)",
        [req.userId, pid, name, nik||null, birth_date||null, address||null, sex||null]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // Pegawai: semua. Masyarakat: hanya milik parent_id=akun login
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const sql = role==="PEGAWAI_POSYANDU"
        ? "SELECT * FROM children ORDER BY created_at DESC"
        : "SELECT * FROM children WHERE parent_id=? ORDER BY created_at DESC";
      const params = role==="PEGAWAI_POSYANDU" ? [] : [req.userId];
      const [rows]=await pool.execute(sql,params);
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
