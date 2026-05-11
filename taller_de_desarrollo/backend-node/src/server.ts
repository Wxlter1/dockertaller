import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import axios from 'axios';
import { AppDataSource } from './config/database';
import { ParkingSpot } from './entities/ParkingSpot';
import { ParkingDetection } from './entities/ParkingDetection';
import { parkingRoutes } from './routes/parking';

const app: Express = express();
const PORT = process.env.PORT || 3000;
const pythonBase = process.env.PYTHON_API_URL || 'http://python-api:8000/api/v1/parking';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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

// Servir frontend
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Servidor Node + TypeORM escuchando en puerto ${PORT}`);
  console.log(`→ UI: http://localhost:${PORT}`);
  console.log(`→ API: http://localhost:${PORT}/api/parking/status`);
});
