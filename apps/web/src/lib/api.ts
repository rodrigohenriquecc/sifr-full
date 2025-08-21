import axios from 'axios'
export type Occurrence = { id?:string, tipo?:string, rodovia?:string, km?:number, lat:number, lng:number, data?:string, obs?:string, fiscal?:string, photos?:string[] }

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' })

export async function fetchOccurrences(params:any){
  const { data } = await api.get('/occurrences', { params })
  return data as Occurrence[]
}

export async function getPresignedUrl(contentType='image/jpeg'){
  const { data } = await api.get('/upload/presign', { params:{ contentType } })
  return data as { uploadUrl:string, key:string, publicUrl:string }
}
