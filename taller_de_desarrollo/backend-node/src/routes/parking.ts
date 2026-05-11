import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ParkingSpot } from '../entities/ParkingSpot';
import { ParkingDetection } from '../entities/ParkingDetection';
import axios from 'axios';

export const parkingRoutes = Router();
const pythonBase = process.env.PYTHON_API_URL || 'http://python-api:8000/api/v1/parking';

const spotRepository = AppDataSource.getRepository(ParkingSpot);
const detectionRepository = AppDataSource.getRepository(ParkingDetection);

// GET: Estado actual de todas las plazas
parkingRoutes.get('/status', async (req: Request, res: Response) => {
  try {
    const spots = await spotRepository.find({ order: { spot_code: 'ASC' } });
    res.json(spots);
  } catch (error) {
    console.error('Error al obtener estado:', error);
    res.status(500).json({ error: 'Error al obtener estado de estacionamientos' });
  }
});

// GET: Resumen de ocupación
parkingRoutes.get('/summary', async (req: Request, res: Response) => {
  try {
    const spots = await spotRepository.find();
    const occupied = spots.filter((s) => s.status === 'occupied').length;
    const available = spots.filter((s) => s.status === 'available').length;
    const lastUpdated = spots.length > 0 ? new Date(Math.max(...spots.map((s) => s.updated_at.getTime()))) : null;

    res.json({
      total_spots: spots.length,
      occupied_count: occupied,
      available_count: available,
      last_updated: lastUpdated,
    });
  } catch (error) {
    console.error('Error al calcular resumen:', error);
    res.status(500).json({ error: 'Error al calcular resumen' });
  }
});

// POST: Recibir detección de plaza
parkingRoutes.post('/detections', async (req: Request, res: Response) => {
  const { spot_code, name, status, confidence, timestamp } = req.body;

  if (!spot_code || !name || !status) {
    return res.status(400).json({ error: 'spot_code, name y status son obligatorios' });
  }

  try {
    const now = timestamp ? new Date(timestamp) : new Date();

    // Actualizar o crear plaza
    let spot = await spotRepository.findOne({ where: { spot_code } });
    if (spot) {
      spot.name = name;
      spot.status = status as 'available' | 'occupied';
      spot.confidence = confidence || null;
      spot.last_seen = now;
    } else {
      spot = spotRepository.create({
        spot_code,
        name,
        status: status as 'available' | 'occupied',
        confidence: confidence || null,
        last_seen: now,
      });
    }
    await spotRepository.save(spot);

    // Guardar histórico de detección
    const detection = detectionRepository.create({
      spot_code,
      status: status as 'available' | 'occupied',
      confidence: confidence || null,
      timestamp: now,
    });
    await detectionRepository.save(detection);

    // Reenviar al API Python (no blocking)
    axios
      .post(`${pythonBase}/detections`, {
        spot_code,
        name,
        status,
        confidence,
        timestamp: now.toISOString(),
      })
      .catch(() => {});

    res.status(201).json(spot);
  } catch (error) {
    console.error('Error al guardar detección:', error);
    res.status(500).json({ error: 'Error al guardar la detección' });
  }
});

// GET: Histórico de detecciones (últimas N)
parkingRoutes.get('/detections/:spotCode', async (req: Request, res: Response) => {
  const { spotCode } = req.params;
  const limit = parseInt(req.query.limit as string) || 20;

  try {
    const detections = await detectionRepository.find({
      where: { spot_code: spotCode },
      order: { timestamp: 'DESC' },
      take: limit,
    });
    res.json(detections);
  } catch (error) {
    console.error('Error al obtener histórico:', error);
    res.status(500).json({ error: 'Error al obtener histórico' });
  }
});

// GET: Estadísticas por sector
parkingRoutes.get('/sectors/summary', async (req: Request, res: Response) => {
  try {
    const spots = await spotRepository.find();
    const sectors = new Map<string, { occupied: number; total: number }>();

    spots.forEach((spot) => {
      const sectorId = spot.spot_code.charAt(0);
      if (!sectors.has(sectorId)) {
        sectors.set(sectorId, { occupied: 0, total: 0 });
      }
      const sector = sectors.get(sectorId)!;
      sector.total += 1;
      if (spot.status === 'occupied') {
        sector.occupied += 1;
      }
    });

    const result = Array.from(sectors.entries()).map(([id, data]) => ({
      sector: id,
      occupied: data.occupied,
      available: data.total - data.occupied,
      total: data.total,
      occupancy_percentage: ((data.occupied / data.total) * 100).toFixed(2),
    }));

    res.json(result);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});
