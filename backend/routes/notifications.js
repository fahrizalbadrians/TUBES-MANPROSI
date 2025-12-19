import express from "express";
import { requireAuth } from "../middleware/auth.js";

export default function notificationRoutes(pool){
  const r=express.Router();

  // list notifications for current user
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const [rows]=await pool.execute(
        "SELECT * FROM notifications WHERE recipient_id=? ORDER BY created_at DESC LIMIT 100",
        [req.userId]
      );
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.get("/unread-count", requireAuth, async (req,res)=>{
    try{
      const [[row]] = await pool.execute(
        "SELECT COUNT(*) AS c FROM notifications WHERE recipient_id=? AND is_read=0",
        [req.userId]
      );
      res.json({count: Number(row?.c||0)});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.patch("/:id/read", requireAuth, async (req,res)=>{
    try{
      const id=Number(req.params.id);
      if(!id) return res.status(400).json({message:"id tidak valid"});
      await pool.execute(
        "UPDATE notifications SET is_read=1 WHERE id=? AND recipient_id=?",
        [id, req.userId]
      );
      res.json({ok:true});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.patch("/read-all", requireAuth, async (req,res)=>{
    try{
      await pool.execute("UPDATE notifications SET is_read=1 WHERE recipient_id=?",[req.userId]);
      res.json({ok:true});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
