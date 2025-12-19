import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
export default function pmtRoutes(pool){
  const r=express.Router();
  r.post("/", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const {child_id,item,given_at,notes}=req.body||{};
      if(!child_id||!item||!given_at) return res.status(400).json({message:"child_id, item, given_at wajib"});
      const [result]=await pool.execute("INSERT INTO pmt (child_id,recorded_by,item,given_at,notes) VALUES (?,?,?,?,?)",[child_id,req.userId,item,given_at,notes||null]);
      res.json({id:result.insertId});
    }catch(e){res.status(500).json({message:"Server error",detail:String(e?.message||e)});}
  });
  r.get("/", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const child_id=Number(req.query.child_id);
      if(!child_id) return res.status(400).json({message:"child_id query wajib"});

      if(role==="MASYARAKAT"){
        const [[c]] = await pool.execute("SELECT parent_id FROM children WHERE id=? LIMIT 1",[child_id]);
        if(!c || Number(c.parent_id||0)!==Number(req.userId)) return res.status(403).json({message:"Forbidden"});
      }

      const [rows]=await pool.execute("SELECT * FROM pmt WHERE child_id=? ORDER BY given_at DESC",[child_id]);
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });
  return r;
}
