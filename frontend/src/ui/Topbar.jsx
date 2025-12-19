import { useNavigate } from "react-router-dom";
import { Button } from "./Button.jsx";
export function Topbar({title,subtitle,backTo,right}){
  const nav=useNavigate();
  return (<div className="mb-4 flex items-start justify-between gap-3">
    <div>
      <div className="flex items-center gap-2">
        {backTo && <Button variant="outline" onClick={()=>nav(backTo)} className="px-3">←</Button>}
        <h1 className="text-xl font-extrabold">{title}</h1>
      </div>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </div>
    {right}
  </div>);
}
