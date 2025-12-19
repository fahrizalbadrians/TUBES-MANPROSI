import { useEffect, useMemo, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";

export default function PenimbanganPage(){
  const tabs = useMemo(() => [
    { key: "CHILD", label: "Balita" },
    { key: "PREGNANT", label: "Ibu Hamil" },
    { key: "ELDERLY", label: "Lansia" },
  ], []);

  const [tab, setTab] = useState("CHILD");
  const [people, setPeople] = useState([]);
  const [personId, setPersonId] = useState("");

  const [form, setForm] = useState({
    weight_kg: "",
    height_cm: "",
    blood_pressure: "",
    blood_sugar: "",
    cholesterol: "",
    notes: "",
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function loadPeople(kind){
    try{
      if(kind === "CHILD"){
        setPeople(await api.listChildren());
      } else if(kind === "PREGNANT"){
        setPeople(await api.listPregnant());
      } else {
        setPeople(await api.listElderly());
      }
    }catch(_e){
      setPeople([]);
    }
  }

  useEffect(()=>{ loadPeople(tab); },[tab]);

  async function submit(){
    try{
      setErr("");
      setMsg("");
      await api.addMeasurement({
        person_type: tab,
        person_id: Number(personId),
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        blood_pressure: form.blood_pressure || null,
        blood_sugar: form.blood_sugar ? Number(form.blood_sugar) : null,
        cholesterol: form.cholesterol ? Number(form.cholesterol) : null,
        notes: form.notes || null,
      });
      setMsg("✅ Pemeriksaan tersimpan (cek Notifikasi jika ada anomali).");
      setForm({weight_kg:"",height_cm:"",blood_pressure:"",blood_sugar:"",cholesterol:"",notes:""});
    }catch(e){
      setErr(e.message);
    }
  }

  const title = tab==="CHILD" ? "Penimbangan & Status Balita" : (tab==="PREGNANT" ? "Pemeriksaan Ibu Hamil" : "Pemeriksaan Lansia");

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Topbar title={title} backTo="/app/dashboard" subtitle="BB/TB + Tekanan Darah + Gula + Kolesterol" />

      <div className="mb-4 flex gap-2">
        {tabs.map(t=>(
          <button
            key={t.key}
            onClick={()=>{setTab(t.key); setPersonId("");}}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab===t.key?"bg-white border border-slate-200 shadow-sm":"bg-slate-100 text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="text-sm font-semibold">Pilih {tab==="CHILD"?"Balita":tab==="PREGNANT"?"Ibu Hamil":"Lansia"}</div>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2"
          value={personId}
          onChange={(e)=>setPersonId(e.target.value)}
        >
          <option value="">-- pilih --</option>
          {people.map(p => (
            <option key={p.id} value={p.id}>{p.name} (id:{p.id})</option>
          ))}
        </select>
        {people.length===0 && (
          <div className="mt-2 text-xs text-slate-500">
            Belum ada data. (Pegawai: buat dulu di menu Pencatatan.)
          </div>
        )}
      </Card>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Berat (kg)" value={form.weight_kg} onChange={(e)=>setForm({...form,weight_kg:e.target.value})} />

          {tab==="CHILD" ? (
            <Input label="Tinggi (cm)" value={form.height_cm} onChange={(e)=>setForm({...form,height_cm:e.target.value})} />
          ) : (
            <Input label="Tinggi (cm) (opsional)" value={form.height_cm} onChange={(e)=>setForm({...form,height_cm:e.target.value})} />
          )}

          <Input label="Tekanan Darah" value={form.blood_pressure} onChange={(e)=>setForm({...form,blood_pressure:e.target.value})} placeholder="120/80" />
          <Input label="Gula Darah" value={form.blood_sugar} onChange={(e)=>setForm({...form,blood_sugar:e.target.value})} placeholder="95" />
          <Input label="Kolesterol" value={form.cholesterol} onChange={(e)=>setForm({...form,cholesterol:e.target.value})} placeholder="200" />
          <Input label="Catatan" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} />
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        {msg && <div className="mt-3 text-sm text-emerald-700">{msg}</div>}

        <div className="mt-4">
          <Button onClick={submit} disabled={!personId}>Simpan Pemeriksaan</Button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Catatan: ambang batas notifikasi untuk demo (bukan diagnosis). Notifikasi akan muncul bila: TD tinggi/rendah, gula tinggi/rendah, kolesterol tinggi, atau balita terindikasi stunting.
        </div>
      </Card>
    </div>
  );
}
