import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { api } from "../../core/api.js";

export default function RegisterPage(){
  const nav=useNavigate();
  const [sp]=useSearchParams();
  const role=useMemo(()=>sp.get("role")||"MASYARAKAT",[sp]);

  const [full_name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPass]=useState("");
  const [err,setErr]=useState("");
  const [ok,setOk]=useState("");

  async function submit(){
    try{
      setErr("");
      setOk("");
      if(role==="PEGAWAI_POSYANDU" && !email.toLowerCase().endsWith("@gosyandu.com")){
        return setErr("Email pegawai harus menggunakan domain @gosyandu.com");
      }
      await api.register({full_name,email,password,role});
      setOk("Registrasi berhasil. Silakan login.");
      setTimeout(()=>nav(`/auth/login?role=${role}`),500);
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <h1 className="text-2xl font-extrabold">Buat Akun</h1>
        <p className="mt-1 text-sm text-slate-600">Role: <b>{role}</b></p>
        {role==="PEGAWAI_POSYANDU" && (
          <p className="mt-2 text-xs text-slate-500">
            Pendaftaran Pegawai wajib memakai email domain <b>@gosyandu.com</b>.
          </p>
        )}
        <div className="mt-5 grid gap-3">
          <Input label="Nama" value={full_name} onChange={(e)=>setName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e)=>setPass(e.target.value)} placeholder="Min 8 karakter" />
          {err && <div className="text-sm text-red-600">{err}</div>}
          {ok && <div className="text-sm text-emerald-700">{ok}</div>}
          <Button onClick={submit}>Daftar</Button>
          <Button variant="outline" onClick={()=>nav(-1)}>Kembali</Button>
        </div>
      </Card>
    </div>
  );
}
