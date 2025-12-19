import { useEffect, useMemo, useState } from "react";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";

export default function PencatatanPage(){
  const [tab,setTab]=useState("CHILD");
  const [users,setUsers]=useState([]);
  const [loadingUsers,setLoadingUsers]=useState(false);

  const [form,setForm]=useState({
    name:"",
    nik:"",
    birth_date:"",
    address:"",
    sex:"L",
    hpht:"",
    linked_user_id:"" // masyarakat id (untuk CHILD: parent_id, untuk PREGNANT/ELDERLY: user_id)
  });

  const [msg,setMsg]=useState("");
  const [err,setErr]=useState("");

  const tabs=useMemo(()=>[
    {key:"CHILD",label:"Balita"},
    {key:"PREGNANT",label:"Ibu Hamil"},
    {key:"ELDERLY",label:"Lansia"}
  ],[]);

  useEffect(()=>{
    (async()=>{
      try{
        setLoadingUsers(true);
        const u = await api.listUsers("MASYARAKAT");
        setUsers(u);
      }catch(_e){
        setUsers([]);
        // supaya jelas kenapa dropdown warga kosong (mis. 403 Forbidden karena role mismatch)
        setErr(_e?.message || "Gagal memuat daftar warga");
      }finally{
        setLoadingUsers(false);
      }
    })();
  },[]);

  async function submit(){
    try{
      setErr("");setMsg("");
      const linked = form.linked_user_id ? Number(form.linked_user_id) : null;

      if(tab==="CHILD"){
        await api.createChild({
          name:form.name,
          nik:form.nik||null,
          birth_date:form.birth_date||null,
          address:form.address||null,
          sex:form.sex||null,
          parent_id: linked
        });
      }else if(tab==="PREGNANT"){
        await api.createPregnant({
          name:form.name,
          nik:form.nik||null,
          birth_date:form.birth_date||null,
          address:form.address||null,
          hpht: form.hpht||null,
          user_id: linked
        });
      }else{
        await api.createElderly({
          name:form.name,
          nik:form.nik||null,
          birth_date:form.birth_date||null,
          address:form.address||null,
          user_id: linked
        });
      }

      setMsg("✅ Tersimpan ke database.");
      setForm({name:"",nik:"",birth_date:"",address:"",sex:"L",hpht:"",linked_user_id:""});
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Topbar title="Pencatatan Dasar" backTo="/app/dashboard" subtitle="Input data Balita / Ibu Hamil / Lansia" />

      <div className="mb-4 flex gap-2">
        {tabs.map(t=>(
          <button
            key={t.key}
            onClick={()=>setTab(t.key)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${tab===t.key?"bg-white border border-slate-200 shadow-sm":"bg-slate-100 text-slate-600"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Nama" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
          <Input label="NIK" value={form.nik} onChange={(e)=>setForm({...form,nik:e.target.value})}/>
          <Input label="Tanggal Lahir" type="date" value={form.birth_date} onChange={(e)=>setForm({...form,birth_date:e.target.value})}/>
          <Input label="Alamat" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/>

          {tab==="CHILD" && (
            <>
              <Input label="Jenis Kelamin (L/P)" value={form.sex} onChange={(e)=>setForm({...form,sex:e.target.value})}/>
              <label className="block">
                <div className="mb-1 text-xs text-slate-600">Akun Orang Tua (Masyarakat) - agar muncul saat login warga</div>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2"
                  value={form.linked_user_id}
                  onChange={(e)=>setForm({...form,linked_user_id:e.target.value})}
                >
                  <option value="">(opsional) pilih warga...</option>
                  {users.map(u=>(
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
                {loadingUsers && <div className="mt-1 text-xs text-slate-500">Memuat daftar warga...</div>}
                {!loadingUsers && users.length===0 && (
                  <div className="mt-1 text-xs text-amber-600">
                    Daftar warga kosong. Pastikan sudah ada akun <b>Masyarakat</b> (Register sebagai Masyarakat) dan Anda login sebagai <b>Pegawai Posyandu</b>. Jika baru update aplikasi, lakukan logout lalu login ulang.
                  </div>
                )}
              </label>
            </>
          )}

          {tab==="PREGNANT" && (
            <>
              <Input label="HPHT (opsional)" type="date" value={form.hpht} onChange={(e)=>setForm({...form,hpht:e.target.value})}/>
              <label className="block">
                <div className="mb-1 text-xs text-slate-600">Akun Masyarakat (opsional) - agar muncul saat login warga</div>
                <select
                  className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2"
                  value={form.linked_user_id}
                  onChange={(e)=>setForm({...form,linked_user_id:e.target.value})}
                >
                  <option value="">(opsional) pilih warga...</option>
                  {users.map(u=>(
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
                {loadingUsers && <div className="mt-1 text-xs text-slate-500">Memuat daftar warga...</div>}
                {!loadingUsers && users.length===0 && (
                  <div className="mt-1 text-xs text-amber-600">
                    Daftar warga kosong. Pastikan sudah ada akun <b>Masyarakat</b> dan Anda login sebagai <b>Pegawai Posyandu</b>.
                  </div>
                )}
              </label>
            </>
          )}

          {tab==="ELDERLY" && (
            <label className="block">
              <div className="mb-1 text-xs text-slate-600">Akun Masyarakat (opsional) - agar muncul saat login warga</div>
              <select
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2"
                value={form.linked_user_id}
                onChange={(e)=>setForm({...form,linked_user_id:e.target.value})}
              >
                <option value="">(opsional) pilih warga...</option>
                {users.map(u=>(
                  <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                ))}
              </select>
              {loadingUsers && <div className="mt-1 text-xs text-slate-500">Memuat daftar warga...</div>}
            {!loadingUsers && users.length===0 && (
              <div className="mt-1 text-xs text-amber-600">
                Daftar warga kosong. Pastikan sudah ada akun <b>Masyarakat</b> dan Anda login sebagai <b>Pegawai Posyandu</b>.
              </div>
            )}
            </label>
          )}
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        {msg && <div className="mt-3 text-sm text-emerald-700">{msg}</div>}

        <div className="mt-4">
          <Button onClick={submit} disabled={!form.name}>Simpan</Button>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          Catatan: agar data Balita/Ibu Hamil/Lansia muncul saat login <b>Masyarakat</b>, pilih akun warga pada field di atas.
        </div>
      </Card>
    </div>
  );
}
