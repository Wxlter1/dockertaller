const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { openDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const pythonBase = process.env.PYTHON_API_URL || 'http://python-api:8000/api/v1/parking';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/parking/status', async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all('SELECT spot_code, name, status, confidence, last_seen FROM parking_spots ORDER BY spot_code');
    await db.close();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer el estado de estacionamiento' });
  }
});

app.get('/api/parking/summary', async (req, res) => {
  try {
    const db = await openDb();
    const rows = await db.all('SELECT status FROM parking_spots');
    await db.close();
    const occupied = rows.filter((row) => row.status === 'occupied').length;
    const available = rows.filter((row) => row.status === 'available').length;
    res.json({
      total_spots: rows.length,
      occupied_count: occupied,
      available_count: available,
      last_updated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al calcular el resumen de estacionamientos' });
  }
});

app.post('/api/parking/detections', async (req, res) => {
  const { spot_code, name, status, confidence, timestamp } = req.body;
  if (!spot_code || !name || !status) {
    return res.status(400).json({ error: 'spot_code, name y status son obligatorios' });
  }

  try {
    const db = await openDb();
    const now = timestamp || new Date().toISOString();

    await db.run(
      `INSERT INTO parking_spots (spot_code, name, status, confidence, last_seen)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(spot_code) DO UPDATE SET
         name=excluded.name,
         status=excluded.status,
         confidence=excluded.confidence,
         last_seen=excluded.last_seen`,
      [spot_code, name, status, confidence, now]
    );

    await db.run(
      `INSERT INTO parking_detections (spot_code, status, confidence, timestamp)
       VALUES (?, ?, ?, ?)`,
      [spot_code, status, confidence, now]
    );

    await db.close();

    await axios.post(`${pythonBase}/detections`, { spot_code, name, status, confidence, timestamp: now }).catch(() => {});

    res.status(201).json({ spot_code, name, status, confidence, last_seen: now });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la detección' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
