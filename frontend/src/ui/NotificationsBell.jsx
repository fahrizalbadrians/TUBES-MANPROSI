import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../core/api.js";

export function NotificationsBell(){
  const nav=useNavigate();
  const [count,setCount]=useState(0);

  async function refresh(){
    try{ const r=await api.unreadCount(); setCount(Number(r?.count||0)); }catch(_e){}
  }

  useEffect(()=>{
    refresh();
    const t=setInterval(refresh, 20000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <button
      onClick={()=>nav("/app/notifikasi")}
      className="relative rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
      title="Notifikasi"
    >
      🔔
      {count>0 && (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
