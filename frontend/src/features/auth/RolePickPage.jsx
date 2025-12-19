import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
export default function RolePickPage(){
  const nav=useNavigate();
  return (<div className="mx-auto max-w-md p-6">
    <Card>
      <div className="text-xs font-semibold text-emerald-700">GOSYANDU</div>
      <h1 className="mt-2 text-2xl font-extrabold">Pilih Role</h1>
      <p className="mt-1 text-sm text-slate-600">Pilih akun sesuai peran Anda</p>
      <div className="mt-5 grid gap-3">
        <Button onClick={()=>nav("/auth/login?role=PEGAWAI_POSYANDU")}>Pegawai Posyandu</Button>
        <Button variant="outline" onClick={()=>nav("/auth/login?role=MASYARAKAT")}>Masyarakat</Button>
      </div>
      <div className="mt-4 text-xs text-slate-500"></div>
    </Card>
  </div>);
}
