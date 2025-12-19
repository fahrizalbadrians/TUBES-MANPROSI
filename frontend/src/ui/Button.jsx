export function Button({variant="primary",className="",...props}){
  const base="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition";
  const styles=variant==="primary"?"bg-emerald-600 text-white hover:bg-emerald-700":"border border-slate-300 bg-white hover:bg-slate-50 text-slate-900";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
