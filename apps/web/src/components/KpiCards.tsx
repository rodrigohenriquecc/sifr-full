import React, { useMemo } from 'react'
export type Occurrence = { tipo?:string, rodovia?:string, km?:number, lat:number, lng:number, data?:string, obs?:string, fiscal?:string }
export function KpiCards({ data }:{ data:Occurrence[] }){
  const kpis = useMemo(()=>{
    const occ = data.length
    const km = (occ * 0.5).toFixed(1)
    const fiscais = new Set<string>()
    data.forEach(d => { if (d.fiscal) fiscais.add(d.fiscal) })
    return { occ, km, users: Math.max(1, fiscais.size || Math.round(occ/50)) }
  }, [data])
  const Box = (p:{label:string,val:any}) => (
    <div className="card" style={{textAlign:'center'}}>
      <div style={{fontSize:12,color:'#64748b'}}>{p.label}</div>
      <div style={{fontWeight:700}}>{p.val}</div>
    </div>
  )
  return <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,minWidth:260}}>
    <Box label="Km vistoriados (30d)" val={kpis.km}/>
    <Box label="Ocorrências" val={kpis.occ}/>
    <Box label="Fiscais ativos" val={kpis.users}/>
  </div>
}
