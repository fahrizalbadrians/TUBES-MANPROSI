import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../core/AuthContext.jsx";
import RolePickPage from "../features/auth/RolePickPage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import DashboardPage from "../features/dashboard/DashboardPage.jsx";
import PencatatanPage from "../features/pencatatan/PencatatanPage.jsx";
import PenimbanganPage from "../features/pencatatan/PenimbanganPage.jsx";
import RiwayatPage from "../features/pencatatan/RiwayatPage.jsx";
import EdukasiPage from "../features/edukasi/EdukasiPage.jsx";
import KonsultasiPage from "../features/konsultasi/KonsultasiPage.jsx";
import ProfilePage from "../features/profile/ProfilePage.jsx";
import NotifikasiPage from "../features/notifikasi/NotifikasiPage.jsx";
import TumbuhKembangPage from "../features/tumbuhkembang/TumbuhKembangPage.jsx";

function normalizeRole(role){
  const r = String(role||"").trim().toUpperCase();
  if(r==="PEGAWAI") return "PEGAWAI_POSYANDU";
  if(r==="WARGA") return "MASYARAKAT";
  return r;
}

function Protected({children}){
  const {user}=useAuth();
  return user?children:<Navigate to="/auth/role" replace/>;
}

function ProtectedRole({allowed, children}){
  const {user}=useAuth();
  if(!user) return <Navigate to="/auth/role" replace/>;
  const role = normalizeRole(user.role);
  const ok = (allowed||[]).map(normalizeRole).includes(role);
  return ok ? children : <Navigate to="/app/dashboard" replace/>;
}


export function AppRouter(){
  return (<Routes>
    <Route path="/" element={<Navigate to="/auth/role" replace/>}/>
    <Route path="/auth/role" element={<RolePickPage/>}/>
    <Route path="/auth/login" element={<LoginPage/>}/>
    <Route path="/auth/register" element={<RegisterPage/>}/>
    <Route path="/app/dashboard" element={<Protected><DashboardPage/></Protected>}/>
    <Route path="/app/pencatatan" element={<ProtectedRole allowed={["PEGAWAI_POSYANDU"]}><PencatatanPage/></ProtectedRole>}/>
    <Route path="/app/penimbangan" element={<ProtectedRole allowed={["PEGAWAI_POSYANDU"]}><PenimbanganPage/></ProtectedRole>}/>
    <Route path="/app/riwayat" element={<Protected><RiwayatPage/></Protected>}/>
    <Route path="/app/tumbuh-kembang" element={<Protected><TumbuhKembangPage/></Protected>}/>
    <Route path="/app/notifikasi" element={<Protected><NotifikasiPage/></Protected>}/>
    <Route path="/app/edukasi" element={<Protected><EdukasiPage/></Protected>}/>
    <Route path="/app/konsultasi" element={<Protected><KonsultasiPage/></Protected>}/>
    <Route path="/app/profile" element={<Protected><ProfilePage/></Protected>}/>
    <Route path="*" element={<Navigate to="/auth/role" replace/>}/>
  </Routes>);
}
