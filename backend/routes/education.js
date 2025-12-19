import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

export default function educationRoutes(pool){
  const r=express.Router();

  r.get("/", requireAuth, async (_req,res)=>{
    try{
      const [rows]=await pool.execute(
        "SELECT ep.*, u.full_name AS author_name FROM education_posts ep JOIN users u ON u.id=ep.author_id ORDER BY ep.created_at DESC"
      );
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {type,title,content,media_url}=req.body||{};
      if(!type||!title) return res.status(400).json({message:"type & title wajib"});
      const [result]=await pool.execute(
        "INSERT INTO education_posts (author_id,type,title,content,media_url) VALUES (?,?,?,?,?)",
        [req.userId,type,title,content||null,media_url||null]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.put("/:id", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const id=Number(req.params.id);
      const {type,title,content,media_url}=req.body||{};
      if(!id) return res.status(400).json({message:"id tidak valid"});
      if(!type||!title) return res.status(400).json({message:"type & title wajib"});
      await pool.execute(
        "UPDATE education_posts SET type=?, title=?, content=?, media_url=? WHERE id=?",
        [type,title,content||null,media_url||null,id]
      );
      res.json({ok:true});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.delete("/:id", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const id=Number(req.params.id);
      if(!id) return res.status(400).json({message:"id tidak valid"});
      await pool.execute("DELETE FROM education_posts WHERE id=?",[id]);
      res.json({ok:true});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
