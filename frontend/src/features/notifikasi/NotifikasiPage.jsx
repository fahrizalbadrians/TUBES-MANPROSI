import { useEffect, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";

export default function NotifikasiPage(){
  const [items,setItems]=useState([]);
  const [err,setErr]=useState("");

  async function load(){
    try{ setErr(""); setItems(await api.listNotifications()); }
    catch(e){ setErr(e.message); }
  }
  useEffect(()=>{load();},[]);

  async function markRead(id){
    try{ await api.markRead(id); await load(); }
    catch(_e){}
  }
  async function readAll(){
    try{ await api.readAll(); await load(); }
    catch(_e){}
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Topbar title="Notifikasi" backTo="/app/dashboard" subtitle="Peringatan otomatis: stunting / tekanan darah" right={<Button variant="outline" onClick={readAll}>Tandai semua dibaca</Button>} />
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
      <div className="space-y-3">
        {items.map(n=>(
          <Card key={n.id} className={n.is_read?"opacity-70":""}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold">{n.title}</div>
                <div className="mt-1 text-sm text-slate-700">{n.message}</div>
                <div className="mt-2 text-xs text-slate-500">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.is_read && <Button variant="outline" onClick={()=>markRead(n.id)}>Baca</Button>}
            </div>
          </Card>
        ))}
        {items.length===0 && <Card><div className="text-sm text-slate-600">Belum ada notifikasi.</div></Card>}
      </div>
    </div>
  );
}
