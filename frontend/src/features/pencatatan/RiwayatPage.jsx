import { useEffect, useMemo, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";
import { useAuth } from "../../core/AuthContext.jsx";

function fmtDate(d){
  try{
    return new Date(d).toLocaleDateString();
  }catch(_e){
    return "";
  }
}

function statusBadge(status){
  if(status==="DONE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if(status==="SOON") return "bg-amber-50 text-amber-700 border-amber-200";
  if(status==="DUE") return "bg-orange-50 text-orange-700 border-orange-200";
  if(status==="OVERDUE") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function RiwayatPage(){
  const { user } = useAuth();
  const isPegawai = user?.role === "PEGAWAI_POSYANDU";

  const tabs = useMemo(() => [
    { key: "CHILD", label: "Balita" },
    { key: "PREGNANT", label: "Ibu Hamil" },
    { key: "ELDERLY", label: "Lansia" },
  ], []);

  const [tab, setTab] = useState("CHILD");
  const [people, setPeople] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [meas, setMeas] = useState([]);
  const [imms, setImms] = useState([]);
  const [pmts, setPmts] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const [immForm, setImmForm] = useState({ vaccine: "", given_at: "", notes: "" });
  const [pmtForm, setPmtForm] = useState({ item: "", given_at: "", notes: "" });

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function loadPeople(kind){
    try{
      if(kind === "CHILD") setPeople(await api.listChildren());
      else if(kind === "PREGNANT") setPeople(await api.listPregnant());
      else setPeople(await api.listElderly());
    }catch(_e){
      setPeople([]);
    }
  }

  async function loadData(kind, id){
    if(!id) return;
    try{
      setErr("");
      setMsg("");
      setMeas(await api.listMeasurements(kind, id));

      if(kind === "CHILD"){
        const [a, b] = await Promise.all([
          api.listImmunizations(id),
          api.listPMT(id)
        ]);
        setImms(a);
        setPmts(b);

        try{
          const sch = await api.getImmunizationSchedule(id);
          setSchedule(sch);
        }catch(e){
          // schedule bisa gagal jika tanggal lahir balita kosong
          setSchedule(null);
          // jangan override err utama jika masih ada data lain
          setErr(e.message);
        }
      } else {
        setImms([]);
        setPmts([]);
        setSchedule(null);
      }
    }catch(e){
      setErr(e.message);
    }
  }

  useEffect(()=>{
    loadPeople(tab);
    setSelectedId("");
    setMeas([]);
    setImms([]);
    setPmts([]);
    setSchedule(null);
  },[tab]);

  useEffect(()=>{
    if(!selectedId) return;
    loadData(tab, selectedId);
  },[selectedId, tab]);

  async function addImmunManual(){
    try{
      setErr("");
      setMsg("");
      await api.addImmunization({
        child_id: Number(selectedId),
        vaccine: immForm.vaccine,
        given_at: immForm.given_at,
        notes: immForm.notes || null
      });
      setImmForm({vaccine:"",given_at:"",notes:""});
      setMsg("✅ Imunisasi tersimpan.");
      await loadData("CHILD", selectedId);
    }catch(e){
      setErr(e.message);
    }
  }

  async function markGivenFromSchedule(s){
    try{
      setErr("");
      setMsg("");
      const today = new Date().toISOString().slice(0,10);
      await api.addImmunization({
        child_id: Number(selectedId),
        schedule_id: s.schedule_id,
        vaccine_type_id: s.vaccine_type_id,
        given_at: today
      });
      setMsg("✅ Dicatat sebagai sudah diberikan.");
      await loadData("CHILD", selectedId);
    }catch(e){
      setErr(e.message);
    }
  }

  async function addPmt(){
    try{
      setErr("");
      setMsg("");
      await api.addPMT({
        child_id: Number(selectedId),
        item: pmtForm.item,
        given_at: pmtForm.given_at,
        notes: pmtForm.notes || null
      });
      setPmtForm({item:"",given_at:"",notes:""});
      setMsg("✅ PMT tersimpan.");
      await loadData("CHILD", selectedId);
    }catch(e){
      setErr(e.message);
    }
  }

  const selectedLabel = tab==="CHILD" ? "Balita" : (tab==="PREGNANT" ? "Ibu Hamil" : "Lansia");

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Topbar title="Riwayat Pemeriksaan" backTo="/app/dashboard" subtitle="Riwayat pemeriksaan, imunisasi, PMT + pengingat jatuh tempo" />

      <div className="mb-4 flex gap-2">
        {tabs.map(t=> (
          <button
            key={t.key}
            onClick={()=>setTab(t.key)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab===t.key?"bg-white border border-slate-200 shadow-sm":"bg-slate-100 text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <div className="text-sm font-semibold">Pilih {selectedLabel}</div>
        <select
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2"
          value={selectedId}
          onChange={(e)=>setSelectedId(e.target.value)}
        >
          <option value="">-- pilih --</option>
          {people.map(p => (
            <option key={p.id} value={p.id}>{p.name} (id:{p.id})</option>
          ))}
        </select>
        {people.length===0 && (
          <div className="mt-2 text-xs text-slate-500">Belum ada data.</div>
        )}
      </Card>

      {err && (
        <div className="mb-3 text-sm text-red-600">{err}</div>
      )}
      {msg && (
        <div className="mb-3 text-sm text-emerald-700">{msg}</div>
      )}

      {selectedId && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="font-bold">Riwayat Pemeriksaan</div>
            <div className="mt-3 space-y-2">
              {meas.map(m => (
                <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                  <div className="text-xs text-slate-500">{new Date(m.recorded_at).toLocaleString()}</div>
                  <div className="mt-1 text-slate-700">
                    BB: <b>{m.weight_kg ?? "-"}</b> kg
                    {tab==="CHILD" && (<> • TB: <b>{m.height_cm ?? "-"}</b> cm</>)}
                    <br/>
                    TD: <b>{m.blood_pressure ?? "-"}</b> • Gula: <b>{m.blood_sugar ?? "-"}</b> • Kolesterol: <b>{m.cholesterol ?? "-"}</b>
                  </div>
                  {m.notes && <div className="mt-1 text-xs text-slate-600">Catatan: {m.notes}</div>}
                </div>
              ))}
              {meas.length===0 && (
                <div className="text-sm text-slate-600">Belum ada pemeriksaan.</div>
              )}
            </div>
          </Card>

          {tab==="CHILD" ? (
            <div className="space-y-4">
              <Card>
                <div className="font-bold">Pengingat Imunisasi (Jatuh Tempo)</div>
                <div className="mt-3 space-y-2">
                  {schedule?.schedule?.map(s => (
                    <div key={s.schedule_id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">{s.vaccine_name} - {s.dose_label}</div>
                          <div className="text-xs text-slate-600">Jatuh tempo: {fmtDate(s.due_date)} {s.done_at?`• Diberikan: ${fmtDate(s.done_at)}`:""}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(s.status)}`}>{s.status}</span>
                          {isPegawai && s.status!=="DONE" && (
                            <Button variant="outline" onClick={()=>markGivenFromSchedule(s)}>Catat</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!schedule && (
                    <div className="text-sm text-slate-600">Jadwal belum tersedia (pastikan tanggal lahir balita terisi).</div>
                  )}
                </div>
              </Card>

              <Card>
                <div className="font-bold">Riwayat Imunisasi</div>
                <div className="mt-3 space-y-2">
                  {imms.map(x => (
                    <div key={x.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                      <div className="font-semibold">{x.vaccine}</div>
                      <div className="text-xs text-slate-600">{fmtDate(x.given_at)}</div>
                    </div>
                  ))}
                  {imms.length===0 && <div className="text-sm text-slate-600">Belum ada.</div>}
                </div>

                {isPegawai && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-semibold text-sm">Tambah Imunisasi Manual</div>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <Input label="Nama vaksin" value={immForm.vaccine} onChange={(e)=>setImmForm({...immForm,vaccine:e.target.value})} placeholder="Mis: MR 1" />
                      <Input label="Tanggal" type="date" value={immForm.given_at} onChange={(e)=>setImmForm({...immForm,given_at:e.target.value})} />
                      <Input label="Catatan (opsional)" value={immForm.notes} onChange={(e)=>setImmForm({...immForm,notes:e.target.value})} />
                    </div>
                    <div className="mt-2">
                      <Button onClick={addImmunManual} disabled={!immForm.vaccine || !immForm.given_at}>Simpan Imunisasi</Button>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <div className="font-bold">Riwayat PMT</div>
                <div className="mt-3 space-y-2">
                  {pmts.map(x => (
                    <div key={x.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                      <div className="font-semibold">{x.item}</div>
                      <div className="text-xs text-slate-600">{fmtDate(x.given_at)}</div>
                    </div>
                  ))}
                  {pmts.length===0 && <div className="text-sm text-slate-600">Belum ada.</div>}
                </div>

                {isPegawai && (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-semibold text-sm">Tambah PMT</div>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <Input label="Item PMT" value={pmtForm.item} onChange={(e)=>setPmtForm({...pmtForm,item:e.target.value})} placeholder="Mis: Biskuit, telur, dll" />
                      <Input label="Tanggal" type="date" value={pmtForm.given_at} onChange={(e)=>setPmtForm({...pmtForm,given_at:e.target.value})} />
                      <Input label="Catatan (opsional)" value={pmtForm.notes} onChange={(e)=>setPmtForm({...pmtForm,notes:e.target.value})} />
                    </div>
                    <div className="mt-2">
                      <Button onClick={addPmt} disabled={!pmtForm.item || !pmtForm.given_at}>Simpan PMT</Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <Card>
              <div className="font-bold">Catatan</div>
              <div className="mt-2 text-sm text-slate-600">
                Riwayat imunisasi & PMT hanya untuk Balita. Untuk {selectedLabel}, sistem menyimpan riwayat pemeriksaan (tekanan darah, gula, kolesterol, dll).
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
