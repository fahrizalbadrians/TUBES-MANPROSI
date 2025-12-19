import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { useAuth } from "../../core/AuthContext.jsx";

export default function LoginPage(){
  const nav=useNavigate();
  const { login }=useAuth();
  const [sp]=useSearchParams();
  const role=useMemo(()=>sp.get("role")||"MASYARAKAT",[sp]);
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState("");

  return (<div className="mx-auto max-w-md p-6">
    <Card>
      <h1 className="text-2xl font-extrabold">Masuk</h1>
      <p className="mt-1 text-sm text-slate-600">Role: <b>{role}</b></p>
      <div className="mt-5 grid gap-3">
        <Input label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <Input label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <Button onClick={async ()=>{try{setErr(""); await login(email,password); nav("/app/dashboard");}catch(e){setErr(e.message);}}}>Masuk</Button>
        <Button variant="outline" onClick={()=>nav(`/auth/register?role=${role}`)}>Daftar</Button>
        <Button variant="outline" onClick={()=>nav("/auth/role")}>Ganti Role</Button>
      </div>
    </Card>
  </div>);
}
