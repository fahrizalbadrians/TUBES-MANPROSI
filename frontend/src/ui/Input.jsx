export function Input({label,className="",...props}){
  return (<label className="block w-full">{label&&<div className="mb-1 text-xs text-slate-600">{label}</div>}
    <input className={`w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-emerald-600 ${className}`} {...props}/>
  </label>);
}
