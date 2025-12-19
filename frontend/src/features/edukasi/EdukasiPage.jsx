import { useEffect, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";
import { useAuth } from "../../core/AuthContext.jsx";

export default function EdukasiPage(){
  const { user } = useAuth();
  const isPegawai=user?.role==="PEGAWAI_POSYANDU";
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({type:"ARTICLE",title:"",content:"",media_url:""});
  const [editingId,setEditingId]=useState(null);
  const [err,setErr]=useState(""); const [msg,setMsg]=useState("");

  async function load(){ setItems(await api.listEducation()); }
  useEffect(()=>{load().catch(()=>{});},[]);

  async function submit(){
    try{
      setErr("");setMsg("");
      if(editingId){
        await api.updateEducation(editingId, form);
        setMsg("✅ Edukasi diperbarui.");
      } else {
        await api.createEducation(form);
        setMsg("✅ Edukasi diposting.");
      }
      setForm({type:"ARTICLE",title:"",content:"",media_url:""});
      setEditingId(null);
      await load();
    }catch(e){setErr(e.message);}
  }

  async function del(id){
    if(!confirm("Hapus konten edukasi ini?") ) return;
    try{ await api.deleteEducation(id); await load(); }
    catch(e){setErr(e.message);}
  }

  return (<div className="mx-auto max-w-4xl p-6">
    <Topbar title="Edukasi" backTo="/app/dashboard" subtitle="Artikel/Video/Poster" />
    {isPegawai && <Card className="mb-4">
      <div className="font-bold mb-3">Posting Edukasi (Pegawai)</div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block"><div className="mb-1 text-xs text-slate-600">Tipe</div>
          <select className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2" value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})}>
            <option value="ARTICLE">Artikel</option><option value="VIDEO">Video</option><option value="POSTER">Poster</option>
          </select>
        </label>
        <Input label="Judul" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/>
        <Input label="Media URL (opsional)" value={form.media_url} onChange={(e)=>setForm({...form,media_url:e.target.value})}/>
        <Input label="Konten" value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})}/>
      </div>
      {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      {msg && <div className="mt-3 text-sm text-emerald-700">{msg}</div>}
      <div className="mt-4 flex gap-2">
        <Button onClick={submit}>{editingId?"Simpan":"Posting"}</Button>
        {editingId && <Button variant="outline" onClick={()=>{setEditingId(null);setForm({type:"ARTICLE",title:"",content:"",media_url:""});}}>Batal</Button>}
      </div>
    </Card>}
    <div className="grid gap-3">
      {items.map(it=>(
        <Card key={it.id}>
          <div className="text-xs font-semibold text-emerald-700">{it.type} • {it.author_name}</div>
          <div className="mt-1 font-bold">{it.title}</div>
          {it.content && <div className="mt-2 text-sm text-slate-700">{it.content}</div>}
          {it.media_url && <div className="mt-2 text-sm text-slate-600 break-all">{it.media_url}</div>}
          {isPegawai && (
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={()=>{setEditingId(it.id);setForm({type:it.type,title:it.title,content:it.content||"",media_url:it.media_url||""});}}>Edit</Button>
              <Button variant="outline" onClick={()=>del(it.id)}>Hapus</Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  </div>);
}
