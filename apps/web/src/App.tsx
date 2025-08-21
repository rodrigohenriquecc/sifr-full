import React, { useEffect, useRef, useState } from 'react'
import { KpiCards } from './components/KpiCards'
import { SidebarFilters } from './components/SidebarFilters'
import { fetchOccurrences, Occurrence } from './lib/api'

declare global { interface Window { google:any } }

function loadGoogleMaps(key: string, enableHeat=false){
  const id = 'gmaps-js'
  if (document.getElementById(id)) return Promise.resolve(window.google)
  return new Promise((resolve,reject)=>{
    const s = document.createElement('script')
    s.id = id
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}${enableHeat?'&libraries=visualization':''}&v=weekly`
    s.onload = () => resolve(window.google)
    s.onerror = reject
    document.body.appendChild(s)
  })
}

export default function App(){
  const [rows, setRows] = useState<Occurrence[]>([])
  const [filtered, setFiltered] = useState<Occurrence[]>([])
  const [heat, setHeat] = useState(false)
  const [filters, setFilters] = useState({ rodovia:'', kmi:'', kmf:'', tipo:'', de:'', ate:'' })
  const mapRef = useRef<HTMLDivElement>(null)
  const gmapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const heatRef = useRef<any>(null)
  const clusterRef = useRef<any>(null)

  useEffect(()=>{
    (async()=>{
      await loadGoogleMaps((import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY, heat)
      const { MarkerClusterer } = await import('https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js')
      const map = new window.google.maps.Map(mapRef.current, { center:{lat:-23.55,lng:-46.63}, zoom:8 })
      ;(gmapRef as any).current = { map, MarkerClusterer }
      const data = await fetchOccurrences(filters)
      setRows(data); setFiltered(data); renderMarkers(data)
    })()
  }, [])

  function apply(){
    const f = rows.filter(r => {
      if (filters.rodovia && !(r.rodovia||'').toLowerCase().includes(filters.rodovia.toLowerCase())) return false
      const km = Number(r.km||NaN), kmi = Number(filters.kmi||NaN), kmf = Number(filters.kmf||NaN)
      if (!Number.isNaN(kmi) && !(km >= kmi)) return false
      if (!Number.isNaN(kmf) && !(km <= kmf)) return false
      if (filters.tipo && r.tipo !== filters.tipo) return false
      if (filters.de || filters.ate){
        const d = r.data ? new Date(r.data) : null
        if (!d) return false
        if (filters.de && d < new Date(filters.de)) return false
        if (filters.ate && d > new Date(filters.ate)) return false
      }
      return true
    })
    setFiltered(f)
    renderMarkers(f)
  }

  function clear(){
    setFilters({ rodovia:'', kmi:'', kmf:'', tipo:'', de:'', ate:'' })
    setFiltered(rows)
    renderMarkers(rows)
  }

  function renderMarkers(list:Occurrence[]){
    const { map, MarkerClusterer } = (gmapRef as any).current
    markersRef.current.forEach(m => m.setMap && m.setMap(null))
    markersRef.current = []
    if (clusterRef.current){ clusterRef.current.clearMarkers() }
    if (heatRef.current){ heatRef.current.setMap(null); heatRef.current = null }
    const pts:any[] = []
    list.forEach(r => {
      if (typeof r.lat !== 'number' || typeof r.lng !== 'number') return
      const marker = new window.google.maps.marker.AdvancedMarkerElement({ position:{lat:r.lat,lng:r.lng}, map, title:`${r.tipo||''} • ${r.rodovia||''} • ${r.km||''}` })
      markersRef.current.push(marker)
      marker.addListener('gmp-click', () => {
        new window.google.maps.InfoWindow({content:`<div><b>${r.tipo||''}</b><br/>${r.rodovia||''} • KM ${r.km||''}<br/>${r.data||''}<br/>${r.obs||''}</div>`}).open({ anchor: marker, map })
      })
      pts.push(new window.google.maps.LatLng(r.lat, r.lng))
    })
    clusterRef.current = new MarkerClusterer({ map, markers: markersRef.current })
    if (heat){
      // @ts-ignore
      heatRef.current = new window.google.maps.visualization.HeatmapLayer({ data: pts })
      heatRef.current.setMap(map)
    }
    const b = new window.google.maps.LatLngBounds()
    let c = 0
    markersRef.current.forEach(m => { if (m.position){ b.extend(m.position); c++ } })
    if (c) map.fitBounds(b)
  }

  useEffect(()=>{ if (gmapRef.current) renderMarkers(filtered) }, [heat])

  return (
    <div className="app">
      <header>
        <div style={{maxWidth:1200, margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:36,height:36,display:'grid',placeItems:'center',borderRadius:12,background:'#2563eb',color:'#fff',fontWeight:700}}>S</div>
            <div>
              <div style={{fontWeight:600}}>SIFR – Painel de Fiscalização</div>
              <div style={{fontSize:12,color:'#64748b'}}>Malha 1900 km • Mapa + KPIs</div>
            </div>
          </div>
          <KpiCards data={filtered} />
        </div>
      </header>
      <div style={{maxWidth:1200, margin:'12px auto', display:'grid', gridTemplateColumns:'320px 1fr', gap:16}}>
        <aside className="card">
          <SidebarFilters value={filters} onChange={setFilters} onApply={apply} onClear={clear} heat={heat} setHeat={setHeat} />
        </aside>
        <main className="card" style={{padding:0, overflow:'hidden'}}>
          <div id="map" ref={mapRef}></div>
        </main>
      </div>
    </div>
  )
}
