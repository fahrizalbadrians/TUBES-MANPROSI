import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/AuthContext.jsx";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";
import { Button } from "../../ui/Button.jsx";
import { NotificationsBell } from "../../ui/NotificationsBell.jsx";

export default function DashboardPage(){
  const nav=useNavigate();
  const { user, logout } = useAuth();
  const isPegawai=user?.role==="PEGAWAI_POSYANDU";
  return (<div className="mx-auto max-w-5xl p-6">
    <Topbar title="Dashboard" subtitle={`Login: ${user?.name} (${user?.role})`}
      right={<div className="flex items-center gap-2"><NotificationsBell/><Button variant="outline" onClick={()=>{logout();nav("/auth/role");}}>Logout</Button></div>} />
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <div className="font-bold">Menu</div>
        <div className="mt-3 grid gap-2">
          {isPegawai && <Button onClick={()=>nav("/app/pencatatan")}>Pencatatan Dasar</Button>}
          {isPegawai && <Button variant="outline" onClick={()=>nav("/app/penimbangan")}>Penimbangan & Status</Button>}
          <Button variant="outline" onClick={()=>nav("/app/riwayat")}>Riwayat & Pemeriksaan</Button>
          <Button variant="outline" onClick={()=>nav("/app/tumbuh-kembang")}>Dashboard Tumbuh Kembang Balita</Button>
          <Button variant="outline" onClick={()=>nav("/app/notifikasi")}>Notifikasi</Button>
          <Button variant="outline" onClick={()=>nav("/app/edukasi")}>Edukasi</Button>
          <Button variant="outline" onClick={()=>nav("/app/konsultasi")}>Konsultasi</Button>
          <Button variant="outline" onClick={()=>nav("/app/profile")}>Profil</Button>
        </div>
      </Card>
      <Card>
        <div className="font-bold">Catatan</div>
        <p className="mt-2 text-sm text-slate-600"></p>
      </Card>
    </div>
  </div>);
}
