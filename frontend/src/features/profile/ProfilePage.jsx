import { useAuth } from "../../core/AuthContext.jsx";
import { Topbar } from "../../ui/Topbar.jsx";
import { Card } from "../../ui/Card.jsx";

export default function ProfilePage(){
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-3xl p-6">
      <Topbar title="Profil" backTo="/app/dashboard" />
      <Card>
        <div className="grid gap-2 text-sm">
          <div><span className="text-slate-500">Nama:</span> <b>{user?.name}</b></div>
          <div><span className="text-slate-500">Email:</span> <b>{user?.email}</b></div>
          <div><span className="text-slate-500">Role:</span> <b>{user?.role}</b></div>
        </div>
      </Card>
    </div>
  );
}
