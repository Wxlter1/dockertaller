import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { AppDataSource } from './config/database';
import { parkingRoutes } from './routes/parking';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializar base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('✓ Base de datos TypeORM conectada');
  })
  .catch((error) => {
    console.error('✗ Error en base de datos:', error);
    process.exit(1);
  });

// Rutas API
app.use('/api/parking', parkingRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'node-api' });
});

app.listen(PORT, () => {
  console.log(`✓ Servidor Node + TypeORM escuchando en puerto ${PORT}`);
  console.log(`→ API: http://localhost:${PORT}/api/parking/status`);
});
