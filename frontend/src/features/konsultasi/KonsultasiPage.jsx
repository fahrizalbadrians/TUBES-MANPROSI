import { useEffect, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";
import { useAuth } from "../../core/AuthContext.jsx";

export default function KonsultasiPage(){
  const { user } = useAuth();
  const isPegawai=user?.role==="PEGAWAI_POSYANDU";
  const [threads,setThreads]=useState([]);
  const [active,setActive]=useState(null);
  const [messages,setMessages]=useState([]);
  const [newTitle,setNewTitle]=useState("");
  const [text,setText]=useState("");
  const [err,setErr]=useState("");

  async function loadThreads(){
    const data=await api.listThreads();
    setThreads(data);
    if(!active && data[0]) setActive(data[0]);
  }
  useEffect(()=>{loadThreads().catch(()=>{});},[]);
  useEffect(()=>{
    (async()=>{ if(!active) return; setMessages(await api.listMessages(active.id)); })().catch(()=>{});
  },[active?.id]);

  async function createThread(){
    try{
      setErr("");
      const title=newTitle;
      const r=await api.createThread({title});
      setNewTitle("");
      await loadThreads();
      setActive({id:r.id,title});
    }catch(e){setErr(e.message);}
  }

  async function assign(){
    if(!active) return;
    try{ await api.assignThread(active.id); await loadThreads(); }
    catch(e){setErr(e.message);} 
  }
  async function send(){
    try{
      setErr("");
      await api.sendMessage({thread_id:active.id,message:text});
      setText("");
      setMessages(await api.listMessages(active.id));
    }catch(e){setErr(e.message);}
  }

  return (<div className="mx-auto max-w-5xl p-6">
    <Topbar title="Konsultasi" backTo="/app/dashboard" subtitle="Konsultasi privat (warga ↔ pegawai)" />
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-1">
        <div className="font-bold">Threads</div>
        <div className="mt-3 flex gap-2">
          <Input value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="Judul pertanyaan"/>
          <Button onClick={createThread} disabled={!newTitle}>+</Button>
        </div>
        {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
        <div className="mt-3 space-y-2">
          {threads.map(t=>(
            <button key={t.id} onClick={()=>setActive(t)} className={`w-full rounded-2xl border p-3 text-left text-sm ${active?.id===t.id?"border-emerald-300 bg-emerald-50":"border-slate-200 bg-white"}`}>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-slate-600">
                Warga: {t.client_name} • Pegawai: {t.staff_name||"(belum ditangani)"}
              </div>
            </button>
          ))}
        </div>
      </Card>
      <Card className="md:col-span-2">
        <div className="flex items-start justify-between gap-3">
          <div className="font-bold">{active?active.title:"Pilih thread"}</div>
          {isPegawai && active && !active.staff_id && <Button variant="outline" onClick={assign}>Ambil Thread</Button>}
        </div>
        <div className="mt-3 h-72 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">
          {messages.map(m=>(
            <div key={m.id} className="rounded-2xl bg-white border border-slate-200 p-3 text-sm">
              <div className="text-xs text-slate-600">{m.sender_name}</div>
              <div className="mt-1">{m.message}</div>
            </div>
          ))}
          {messages.length===0 && <div className="text-sm text-slate-600">Belum ada pesan.</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <Input className="flex-1" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Tulis pesan..."/>
          <Button onClick={send} disabled={!active||!text}>Kirim</Button>
        </div>
      </Card>
    </div>
  </div>);
}
