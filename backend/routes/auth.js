import express from "express";
import bcrypt from "bcryptjs";

const ALLOWED_ROLES = new Set(["PEGAWAI_POSYANDU", "MASYARAKAT"]);

function isValidEmail(email){
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function authRoutes(pool){
  const r = express.Router();

  r.post("/register", async (req,res)=>{
    try{
      const { full_name,email,password,role } = req.body||{};
      if(!full_name||!email||!password||!role) {
        return res.status(400).json({message:"full_name, email, password, role wajib"});
      }
      if(!ALLOWED_ROLES.has(role)) {
        return res.status(400).json({message:"role tidak valid"});
      }
      if(!isValidEmail(email)) {
        return res.status(400).json({message:"Format email tidak valid"});
      }
      // Requirement: jika daftar sebagai Pegawai, email harus @gosyandu.com
      if(role === "PEGAWAI_POSYANDU" && !email.toLowerCase().endsWith("@gosyandu.com")){
        return res.status(400).json({message:"Email pegawai harus menggunakan domain @gosyandu.com"});
      }
      if(String(password).length < 8){
        return res.status(400).json({message:"Password minimal 8 karakter"});
      }

      const hash = await bcrypt.hash(password,10);
      await pool.execute(
        "INSERT INTO users (full_name,email,password_hash,role) VALUES (?,?,?,?)",
        [full_name,email,hash,role]
      );
      res.json({message:"Register success"});
    }catch(e){
      const msg=String(e?.message||e);
      if(msg.includes("Duplicate") || msg.includes("ER_DUP_ENTRY")) {
        return res.status(409).json({message:"Email sudah dipakai"});
      }
      res.status(500).json({message:"Server error",detail:msg});
    }
  });

  r.post("/login", async (req,res)=>{
    try{
      const {email,password}=req.body||{};
      if(!email||!password) return res.status(400).json({message:"email & password wajib"});
      const [rows]=await pool.execute(
        "SELECT id,full_name,email,password_hash,role FROM users WHERE email=? LIMIT 1",
        [email]
      );
      const u=rows?.[0];
      if(!u) return res.status(401).json({message:"User tidak ditemukan"});
      const ok=await bcrypt.compare(password,u.password_hash);
      if(!ok) return res.status(401).json({message:"Password salah"});
      res.json({id:u.id,name:u.full_name,email:u.email,role:u.role});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
