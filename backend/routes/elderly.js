import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

async function resolveMasyarakatUserId(pool, { user_id, user_email }){
  if(user_id) return Number(user_id);
  if(user_email){
    const [[u]] = await pool.execute(
      "SELECT id, role FROM users WHERE email=? LIMIT 1",
      [user_email]
    );
    if(!u) throw new Error("Akun masyarakat (email) tidak ditemukan");
    if(u.role !== "MASYARAKAT") throw new Error("Email tersebut bukan akun Masyarakat");
    return Number(u.id);
  }
  return null;
}

export default function elderlyRoutes(pool){
  const r=express.Router();

  // Pegawai: tambah data lansia (opsional: link ke akun masyarakat via user_id / user_email)
  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {name,nik,birth_date,address,user_id,user_email}=req.body||{};
      if(!name) return res.status(400).json({message:"name wajib"});

      let linkedUserId=null;
      try{
        linkedUserId = await resolveMasyarakatUserId(pool, { user_id, user_email });
      }catch(e){
        return res.status(400).json({message:e.message});
      }

      const [result]=await pool.execute(
        "INSERT INTO elderly (created_by,user_id,name,nik,birth_date,address) VALUES (?,?,?,?,?,?)",
        [req.userId, linkedUserId, name, nik||null, birth_date||null, address||null]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // Pegawai: lihat semua. Masyarakat: hanya yang terhubung ke akunnya (user_id)
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const sql = role === "PEGAWAI_POSYANDU"
        ? "SELECT * FROM elderly ORDER BY created_at DESC"
        : "SELECT * FROM elderly WHERE user_id=? ORDER BY created_at DESC";
      const params = role === "PEGAWAI_POSYANDU" ? [] : [req.userId];
      const [rows]=await pool.execute(sql,params);
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
