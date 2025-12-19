const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function headersWithAuth(){
  const raw=localStorage.getItem("gosyandu_user");
  if(!raw) return {"Content-Type":"application/json"};
  const u=JSON.parse(raw);
  return {
    "Content-Type":"application/json",
    "x-user-id":String(u.id),
    "x-user-role":String(u.role)
  };
}

async function req(path,{method="GET",body}={}){
  const res=await fetch(`${API_URL}${path}`,{method,headers:headersWithAuth(),body:body?JSON.stringify(body):undefined});
  // Some endpoints may return empty body
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data?.message||`HTTP ${res.status}`);
  return data;
}

export const api={
  // auth
  register:(p)=>req("/api/auth/register",{method:"POST",body:p}),
  login:(p)=>req("/api/auth/login",{method:"POST",body:p}),

  // users (pegawai only)
  listUsers:(role="MASYARAKAT", q="")=>req(`/api/users?role=${encodeURIComponent(role)}&q=${encodeURIComponent(q)}`),

  // master data
  listChildren:()=>req("/api/children"),
  createChild:(p)=>req("/api/children",{method:"POST",body:p}),
  listPregnant:()=>req("/api/pregnant"),
  createPregnant:(p)=>req("/api/pregnant",{method:"POST",body:p}),
  listElderly:()=>req("/api/elderly"),
  createElderly:(p)=>req("/api/elderly",{method:"POST",body:p}),

  // measurements
  addMeasurement:(p)=>req("/api/measurements",{method:"POST",body:p}),
  listMeasurements:(t,id)=>req(`/api/measurements?person_type=${encodeURIComponent(t)}&person_id=${encodeURIComponent(id)}`),

  // immunization
  addImmunization:(p)=>req("/api/immunizations",{method:"POST",body:p}),
  listImmunizations:(id)=>req(`/api/immunizations?child_id=${encodeURIComponent(id)}`),
  getImmunizationSchedule:(id)=>req(`/api/immunizations/schedule?child_id=${encodeURIComponent(id)}`),

  // pmt
  addPMT:(p)=>req("/api/pmt",{method:"POST",body:p}),
  listPMT:(id)=>req(`/api/pmt?child_id=${encodeURIComponent(id)}`),

  // education
  listEducation:()=>req("/api/education"),
  createEducation:(p)=>req("/api/education",{method:"POST",body:p}),
  updateEducation:(id,p)=>req(`/api/education/${encodeURIComponent(id)}`,{method:"PUT",body:p}),
  deleteEducation:(id)=>req(`/api/education/${encodeURIComponent(id)}`,{method:"DELETE"}),

  // consult
  listThreads:()=>req("/api/consult/threads"),
  createThread:(p)=>req("/api/consult/threads",{method:"POST",body:p}),
  assignThread:(id)=>req(`/api/consult/threads/${encodeURIComponent(id)}/assign`,{method:"POST"}),
  listMessages:(id)=>req(`/api/consult/messages?thread_id=${encodeURIComponent(id)}`),
  sendMessage:(p)=>req("/api/consult/messages",{method:"POST",body:p}),

  // notifications
  listNotifications:()=>req("/api/notifications"),
  unreadCount:()=>req("/api/notifications/unread-count"),
  markRead:(id)=>req(`/api/notifications/${encodeURIComponent(id)}/read`,{method:"PATCH"}),
  readAll:()=>req("/api/notifications/read-all",{method:"PATCH"}),

  // diagnose
  diagnose:()=>req("/api/diagnose"),
};

export { API_URL };
