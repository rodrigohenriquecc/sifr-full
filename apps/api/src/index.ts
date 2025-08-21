import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Pool } from 'pg';
import occurrencesRouter from './routes/occurrences.js';
import uploadRouter from './routes/upload.js';
import reportsRouter from './routes/reports.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((req, _res, next) => {
  (req as any).io = io;
  (req as any).db = pool;
  next();
});
app.use('/occurrences', occurrencesRouter);
app.use('/upload', uploadRouter);
app.use('/reports', reportsRouter);

const PORT = Number(process.env.PORT) || 4000;
httpServer.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
