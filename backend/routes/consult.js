import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

async function canAccessThread(pool, threadId, userId, role){
  const [[t]] = await pool.execute(
    "SELECT id, client_id, staff_id FROM consult_threads WHERE id=?",
    [threadId]
  );
  if(!t) return {ok:false, reason:"Thread tidak ditemukan"};
  if(role==="PEGAWAI_POSYANDU"){
    // staff can access assigned threads or unassigned (for triage)
    if(t.staff_id==null || Number(t.staff_id)===Number(userId)) return {ok:true, thread:t};
    return {ok:false, reason:"Thread sudah ditangani pegawai lain"};
  }
  // masyarakat
  if(Number(t.client_id)===Number(userId)) return {ok:true, thread:t};
  return {ok:false, reason:"Forbidden"};
}

export default function consultRoutes(pool){
  const r=express.Router();

  // Create private thread
  r.post("/threads", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const {title, client_id}=req.body||{};
      if(!title) return res.status(400).json({message:"title wajib"});

      let clientId;
      if(role==="MASYARAKAT"){
        clientId=req.userId;
      } else {
        // pegawai can create on behalf of a warga (optional)
        clientId = client_id ? Number(client_id) : req.userId;
      }

      const [result]=await pool.execute(
        "INSERT INTO consult_threads (created_by,client_id,staff_id,is_private,title) VALUES (?,?,?,?,?)",
        [req.userId, clientId, role==="PEGAWAI_POSYANDU" ? req.userId : null, 1, title]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // List threads (private)
  r.get("/threads", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      let sql;
      let params=[];
      if(role==="PEGAWAI_POSYANDU"){
        sql = `
          SELECT t.*, 
            u.full_name AS created_by_name,
            c.full_name AS client_name,
            s.full_name AS staff_name
          FROM consult_threads t
          JOIN users u ON u.id=t.created_by
          JOIN users c ON c.id=t.client_id
          LEFT JOIN users s ON s.id=t.staff_id
          WHERE (t.staff_id IS NULL OR t.staff_id=?)
          ORDER BY t.created_at DESC
        `;
        params=[req.userId];
      } else {
        sql = `
          SELECT t.*, 
            u.full_name AS created_by_name,
            c.full_name AS client_name,
            s.full_name AS staff_name
          FROM consult_threads t
          JOIN users u ON u.id=t.created_by
          JOIN users c ON c.id=t.client_id
          LEFT JOIN users s ON s.id=t.staff_id
          WHERE t.client_id=?
          ORDER BY t.created_at DESC
        `;
        params=[req.userId];
      }
      const [rows]=await pool.execute(sql,params);
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  // Assign (pegawai) - make it private to one staff
  r.post("/threads/:id/assign", requireAuth, requireRole("PEGAWAI_POSYANDU"), async (req,res)=>{
    try{
      const id=Number(req.params.id);
      if(!id) return res.status(400).json({message:"id tidak valid"});
      const [[t]] = await pool.execute("SELECT id, staff_id FROM consult_threads WHERE id=?",[id]);
      if(!t) return res.status(404).json({message:"Thread tidak ditemukan"});
      if(t.staff_id && Number(t.staff_id)!==Number(req.userId)) return res.status(409).json({message:"Thread sudah ditangani pegawai lain"});
      await pool.execute("UPDATE consult_threads SET staff_id=? WHERE id=?",[req.userId, id]);
      res.json({ok:true});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.get("/messages", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const thread_id=Number(req.query.thread_id);
      if(!thread_id) return res.status(400).json({message:"thread_id query wajib"});
      const access = await canAccessThread(pool, thread_id, req.userId, role);
      if(!access.ok) return res.status(403).json({message:access.reason});
      const [rows]=await pool.execute(
        "SELECT m.*, u.full_name AS sender_name FROM consult_messages m JOIN users u ON u.id=m.sender_id WHERE m.thread_id=? ORDER BY m.created_at ASC",
        [thread_id]
      );
      res.json(rows);
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  r.post("/messages", requireAuth, async (req,res)=>{
    try{
      const role=req.header("x-user-role");
      const {thread_id,message}=req.body||{};
      if(!thread_id||!message) return res.status(400).json({message:"thread_id & message wajib"});
      const access = await canAccessThread(pool, Number(thread_id), req.userId, role);
      if(!access.ok) return res.status(403).json({message:access.reason});
      // if staff sends message to unassigned thread, auto-assign to them
      if(role==="PEGAWAI_POSYANDU" && access.thread?.staff_id==null){
        await pool.execute("UPDATE consult_threads SET staff_id=? WHERE id=?",[req.userId, Number(thread_id)]);
      }
      const [result]=await pool.execute(
        "INSERT INTO consult_messages (thread_id,sender_id,message) VALUES (?,?,?)",
        [Number(thread_id), req.userId, message]
      );
      res.json({id:result.insertId});
    }catch(e){
      res.status(500).json({message:"Server error",detail:String(e?.message||e)});
    }
  });

  return r;
}
