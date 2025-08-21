import { Router } from 'express';
import { z } from 'zod';

const r = Router();

const createSchema = z.object({
  tipo: z.string().min(1),
  rodovia: z.string().optional(),
  km: z.number().optional(),
  lat: z.number(),
  lng: z.number(),
  obs: z.string().optional(),
  data: z.string().optional(),
  fiscal: z.string().optional(),
  photos: z.array(z.string()).optional()
});

r.get('/', async (req, res) => {
  const db = (req as any).db;
  const { rodovia, tipo, kmi, kmf, de, ate } = req.query as any;
  const clauses: string[] = [];
  const params: any[] = [];
  if (rodovia){ params.push(`%${rodovia}%`); clauses.push(`rodovia ILIKE $${params.length}`); }
  if (tipo){ params.push(tipo); clauses.push(`tipo = $${params.length}`); }
  if (kmi){ params.push(Number(kmi)); clauses.push(`km >= $${params.length}`); }
  if (kmf){ params.push(Number(kmf)); clauses.push(`km <= $${params.length}`); }
  if (de){ params.push(de); clauses.push(`data >= $${params.length}`); }
  if (ate){ params.push(ate); clauses.push(`data <= $${params.length}`); }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM occurrences ${where} ORDER BY created_at DESC LIMIT 5000`;
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

r.post('/', async (req, res) => {
  const io = (req as any).io;
  const db = (req as any).db;
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const o = parse.data;
  const sql = `INSERT INTO occurrences (tipo, rodovia, km, lat, lng, obs, data, fiscal, photos)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
  const values = [o.tipo, o.rodovia||null, o.km||null, o.lat, o.lng, o.obs||null, o.data||null, o.fiscal||null, JSON.stringify(o.photos||[])];
  const { rows } = await db.query(sql, values);
  const created = rows[0];
  io.emit('occurrence:new', created);
  res.status(201).json(created);
});

export default r;
