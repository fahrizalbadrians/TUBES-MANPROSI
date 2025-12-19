import { useEffect, useMemo, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";
import { SvgLineChart } from "../../ui/SvgLineChart.jsx";
import { useAuth } from "../../core/AuthContext.jsx";

function fmtDate(d){
  try{return new Date(d).toLocaleDateString();}catch(_e){return "";}
}

// Simple nutrition classification for demo (NOT a medical diagnosis).
// Uses BMI (BB/(TB^2)) with easy thresholds.
function classifyGizi(weightKg, heightCm){
  const w=Number(weightKg);
  const h=Number(heightCm);
  if(!Number.isFinite(w) || !Number.isFinite(h) || w<=0 || h<=0) return null;
  const bmi = w / Math.pow(h/100, 2);
  // Ambang batas sederhana:
  // <12.5: Gizi buruk, 12.5-<14: Gizi kurang, 14-<=18: Gizi baik, >18: Gizi lebih
  if(bmi < 12.5) return {label:"Gizi buruk", bmi, tone:"red"};
  if(bmi < 14.0) return {label:"Gizi kurang", bmi, tone:"amber"};
  if(bmi <= 18.0) return {label:"Gizi baik", bmi, tone:"emerald"};
  return {label:"Gizi lebih", bmi, tone:"violet"};
}

function badgeClass(tone){
  if(tone==="red") return "bg-red-50 text-red-700 border-red-200";
  if(tone==="amber") return "bg-amber-50 text-amber-700 border-amber-200";
  if(tone==="emerald") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  return "bg-violet-50 text-violet-700 border-violet-200";
}

function statusBadge(status){
  if(status==="DONE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if(status==="SOON") return "bg-amber-50 text-amber-700 border-amber-200";
  if(status==="DUE") return "bg-orange-50 text-orange-700 border-orange-200";
  if(status==="OVERDUE") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export default function TumbuhKembangPage(){
  const { user } = useAuth();
  const isPegawai = user?.role === "PEGAWAI_POSYANDU";

  const [children,setChildren]=useState([]);
  const [active,setActive]=useState(null);
  const [meas,setMeas]=useState([]);
  const [immun,setImmun]=useState([]);
  const [pmt,setPmt]=useState([]);
  const [schedule,setSchedule]=useState(null);
  const [err,setErr]=useState("");

  useEffect(()=>{
    (async()=>{
      try{
        setErr("");
        const c=await api.listChildren();
        setChildren(c);
        if(!active && c[0]) setActive(c[0]);
      }catch(e){setErr(e.message);}
    })();
  },[]);

  async function loadChildData(child){
    if(!child?.id) return;
    try{
      setErr("");
      const m=await api.listMeasurements("CHILD", child.id);
      setMeas(m);
      setImmun(await api.listImmunizations(child.id));
      setPmt(await api.listPMT(child.id));
      try{
        setSchedule(await api.getImmunizationSchedule(child.id));
      }catch(_e){
        setSchedule(null);
      }
    }catch(e){setErr(e.message);}
  }

  useEffect(()=>{ loadChildData(active); },[active?.id]);

  const weightPoints = useMemo(()=>{
    const rows=[...meas].reverse().filter(r=>r.weight_kg!=null);
    return rows.map(r=>({xLabel:fmtDate(r.recorded_at), y:Number(r.weight_kg)}));
  },[meas]);
  const heightPoints = useMemo(()=>{
    const rows=[...meas].reverse().filter(r=>r.height_cm!=null);
    return rows.map(r=>({xLabel:fmtDate(r.recorded_at), y:Number(r.height_cm)}));
  },[meas]);

  const last=meas[0];
  const gizi = useMemo(()=>{
    if(!last?.weight_kg || !last?.height_cm) return null;
    return classifyGizi(last.weight_kg, last.height_cm);
  },[last?.weight_kg, last?.height_cm]);

  async function markGivenFromSchedule(s){
    if(!active?.id) return;
    try{
      setErr("");
      const today = new Date().toISOString().slice(0,10);
      await api.addImmunization({
        child_id: Number(active.id),
        schedule_id: s.schedule_id,
        vaccine_type_id: s.vaccine_type_id,
        given_at: today
      });
      await loadChildData(active);
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Topbar title="Dashboard Tumbuh Kembang Balita" backTo="/app/dashboard" subtitle="Grafik BB/TB, riwayat penimbangan, imunisasi, dan PMT" />
      {err && <div className="mb-3 text-sm text-red-600">{err}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <div className="font-bold">Pilih Balita</div>
          <div className="mt-3 space-y-2">
            {children.map(c=>(
              <button key={c.id} onClick={()=>setActive(c)} className={`w-full rounded-2xl border p-3 text-left text-sm ${active?.id===c.id?"border-emerald-300 bg-emerald-50":"border-slate-200 bg-white"}`}>
                <div className="font-semibold">{c.name}</div>
                <div className="mt-1 text-xs text-slate-600">Lahir: {c.birth_date?fmtDate(c.birth_date):"-"} • {c.sex||"-"}</div>
              </button>
            ))}
            {children.length===0 && <div className="text-sm text-slate-600">Belum ada data balita. (Pegawai: buat dulu di menu Pencatatan.)</div>}
          </div>
        </Card>

        <div className="md:col-span-2 space-y-4">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold">Ringkasan Terakhir</div>
                <div className="mt-2 text-sm text-slate-700">
                  {active?(
                    <>
                      <div>Balita: <b>{active.name}</b></div>
                      <div>Penimbangan terakhir: {last?fmtDate(last.recorded_at):"-"}</div>
                      <div>BB: {last?.weight_kg??"-"} kg • TB: {last?.height_cm??"-"} cm • TD: {last?.blood_pressure??"-"}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-600">Klasifikasi gizi:</span>
                        {gizi ? (
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(gizi.tone)}`}>
                            {gizi.label} <span className="font-normal">(BMI {gizi.bmi.toFixed(1)})</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">Perlu data BB & TB terakhir.</span>
                        )}
                      </div>
                    </>
                  ):("Pilih balita")}
                </div>
              </div>
              <Button variant="outline" onClick={()=>window.location.reload()}>Refresh</Button>
            </div>
          </Card>

          <Card>
            <div className="font-bold">Pengingat Imunisasi</div>
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
              {!schedule && <div className="text-sm text-slate-600">Jadwal belum tersedia (pastikan tanggal lahir balita terisi).</div>}
            </div>
          </Card>

          <Card>
            <div className="font-bold">Grafik Berat Badan (kg)</div>
            <div className="mt-3"><SvgLineChart points={weightPoints} /></div>
          </Card>

          <Card>
            <div className="font-bold">Grafik Tinggi Badan (cm)</div>
            <div className="mt-3"><SvgLineChart points={heightPoints} /></div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="font-bold">Riwayat Imunisasi</div>
              <div className="mt-3 space-y-2">
                {immun.map(i=>(
                  <div key={i.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                    <div className="font-semibold">{i.vaccine}</div>
                    <div className="text-xs text-slate-600">{fmtDate(i.given_at)}</div>
                  </div>
                ))}
                {immun.length===0 && <div className="text-sm text-slate-600">Belum ada data.</div>}
              </div>
            </Card>
            <Card>
              <div className="font-bold">Riwayat PMT</div>
              <div className="mt-3 space-y-2">
                {pmt.map(p=>(
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                    <div className="font-semibold">{p.item}</div>
                    <div className="text-xs text-slate-600">{fmtDate(p.given_at)}</div>
                  </div>
                ))}
                {pmt.length===0 && <div className="text-sm text-slate-600">Belum ada data.</div>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
