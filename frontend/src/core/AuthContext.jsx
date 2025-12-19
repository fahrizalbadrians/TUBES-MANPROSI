import React,{createContext,useContext,useMemo,useState} from "react";
import { api } from "./api.js";
const Ctx=createContext(null);

function normalizeRole(role){
  const r = String(role||"").trim().toUpperCase();
  if(r==="PEGAWAI") return "PEGAWAI_POSYANDU";
  if(r==="WARGA") return "MASYARAKAT";
  return role;
}

export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{
    const raw=localStorage.getItem("gosyandu_user");
    if(!raw) return null;
    try{
      const u = JSON.parse(raw);
      if(u?.role) u.role = normalizeRole(u.role);
      return u;
    }catch{ return null; }
  });
  const value=useMemo(()=>({
    user,
    async login(email,password){
      const u=await api.login({email,password});
      if(u?.role) u.role = normalizeRole(u.role);
      localStorage.setItem("gosyandu_user",JSON.stringify(u));
      setUser(u); return u;
    },
    logout(){localStorage.removeItem("gosyandu_user"); setUser(null);}
  }),[user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth(){return useContext(Ctx);}
