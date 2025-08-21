import React from 'react'

export function SidebarFilters({ value, onChange, onApply, onClear, heat, setHeat }:{
  value:{rodovia:string,kmi:string,kmf:string,tipo:string,de:string,ate:string},
  onChange:(v:any)=>void, onApply:()=>void, onClear:()=>void,
  heat:boolean, setHeat:(v:boolean)=>void
}){
  function set<K extends keyof typeof value>(k:K, v:any){ onChange({ ...value, [k]: v }) }
  return <div>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div style={{fontWeight:600}}>Filtros</div>
      <button onClick={onClear} style={{fontSize:12,color:'#2563eb',background:'transparent',border:'none',cursor:'pointer'}}>Limpar</button>
    </div>
    <label style={{display:'block',fontSize:12,color:'#64748b',marginTop:8}}>Rodovia</label>
    <input value={value.rodovia} onChange={e=>set('rodovia', e.target.value)} placeholder="SP-270..." style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}} />
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8, marginTop:8}}>
      <div>
        <label style={{display:'block',fontSize:12,color:'#64748b'}}>KM inicial</label>
        <input value={value.kmi} onChange={e=>set('kmi', e.target.value)} type="number" step="0.001" style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}}/>
      </div>
      <div>
        <label style={{display:'block',fontSize:12,color:'#64748b'}}>KM final</label>
        <input value={value.kmf} onChange={e=>set('kmf', e.target.value)} type="number" step="0.001" style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}}/>
      </div>
    </div>
    <div style={{marginTop:8}}>
      <label style={{display:'block',fontSize:12,color:'#64748b'}}>Tipo</label>
      <select value={value.tipo} onChange={e=>set('tipo', e.target.value)} style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}}>
        <option value="">Todos</option>
        <option>Material fresado</option>
        <option>Obra</option>
        <option>Risco</option>
        <option>Manutenção</option>
        <option>Sinalização</option>
      </select>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8, marginTop:8}}>
      <div>
        <label style={{display:'block',fontSize:12,color:'#64748b'}}>De</label>
        <input value={value.de} onChange={e=>set('de', e.target.value)} type="date" style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}}/>
      </div>
      <div>
        <label style={{display:'block',fontSize:12,color:'#64748b'}}>Até</label>
        <input value={value.ate} onChange={e=>set('ate', e.target.value)} type="date" style={{width:'100%',padding:'8px',borderRadius:10,border:'1px solid #e2e8f0'}}/>
      </div>
    </div>
    <div style={{display:'flex', gap:8, marginTop:12}}>
      <button onClick={onApply} style={{flex:1, background:'#2563eb', color:'#fff', border:'none', borderRadius:10, padding:'10px 12px', cursor:'pointer'}}>Aplicar</button>
      <button onClick={()=>setHeat(!heat)} style={{border:'1px solid #e2e8f0', borderRadius:10, padding:'10px 12px', cursor:'pointer'}}>Heat</button>
    </div>
  </div>
}
