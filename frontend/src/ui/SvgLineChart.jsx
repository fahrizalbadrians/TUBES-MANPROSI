// Tiny dependency-free line chart for small datasets
export function SvgLineChart({points, height=120}){
  // points: [{xLabel, y}]
  const w=520; // viewBox width
  const h=height;
  const pad=12;
  const ys=points.map(p=>Number(p.y)).filter(n=>Number.isFinite(n));
  if(points.length<2||ys.length<2) return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
      Data belum cukup untuk grafik.
    </div>
  );
  const minY=Math.min(...ys);
  const maxY=Math.max(...ys);
  const span=(maxY-minY)||1;
  const xStep=(w-pad*2)/(points.length-1);
  const toX=(i)=>pad+i*xStep;
  const toY=(val)=>h-pad-((val-minY)/span)*(h-pad*2);
  const d=points.map((p,i)=>`${i===0?"M":"L"}${toX(i)} ${toY(Number(p.y))}`).join(" ");
  const last=points[points.length-1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-2xl border border-slate-200 bg-white">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600" />
      {points.map((p,i)=>{
        const y=Number(p.y);
        if(!Number.isFinite(y)) return null;
        return <circle key={i} cx={toX(i)} cy={toY(y)} r="3" className="fill-emerald-600" />;
      })}
      <text x={pad} y={h-2} fontSize="10" className="fill-slate-500">{points[0]?.xLabel||""}</text>
      <text x={w-pad} y={h-2} textAnchor="end" fontSize="10" className="fill-slate-500">{last?.xLabel||""}</text>
      <text x={pad} y={pad+8} fontSize="10" className="fill-slate-500">{maxY.toFixed(1)}</text>
      <text x={pad} y={h-pad} fontSize="10" className="fill-slate-500">{minY.toFixed(1)}</text>
    </svg>
  );
}
