import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

export default function usersRoutes(pool){
  const r = express.Router();

  function normalizeRole(role){
    const r = String(role||"").trim().toUpperCase();
    if(r === "PEGAWAI") return "PEGAWAI_POSYANDU";
    if(r === "WARGA") return "MASYARAKAT";
    return r;
  }

  // Pegawai bisa lihat list masyarakat untuk linking data (balita/ibu hamil/lansia)
  r.get("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const role = normalizeRole((req.query.role || "MASYARAKAT").toString());
      const q = (req.query.q || "").toString().trim();
      const params=[];
      // kompatibilitas: jika DB lama memakai role PEGAWAI/WARGA, tetap bisa muncul.
      const roleCandidates = [role];
      if(role === "MASYARAKAT") roleCandidates.push("WARGA");
      if(role === "PEGAWAI_POSYANDU") roleCandidates.push("PEGAWAI");

      let sql = `SELECT id, full_name, email, role FROM users WHERE role IN (${roleCandidates.map(()=>"?").join(",")})`;
      params.push(...roleCandidates);
      if(q){
        sql += " AND (full_name LIKE ? OR email LIKE ?)";
        params.push(`%${q}%`, `%${q}%`);
      }
      sql += " ORDER BY full_name ASC LIMIT 200";
      const [rows] = await pool.execute(sql, params);
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
