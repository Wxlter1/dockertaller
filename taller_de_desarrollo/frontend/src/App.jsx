import { useEffect, useState } from 'react';
import ParkingMap from './components/ParkingMap';

const STATUS_LABEL = {
  occupied: 'Ocupado',
  available: 'Disponible',
};

function formatDate(datetime) {
  return datetime ? new Date(datetime).toLocaleString() : '-';
}

function App() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';
  const [spots, setSpots] = useState([]);
  const [summary, setSummary] = useState({ total_spots: 0, occupied_count: 0, available_count: 0, last_updated: null });
  const [form, setForm] = useState({ spot_code: '', name: '', status: 'available', confidence: 0.9 });
  const [saving, setSaving] = useState(false);

  const loadSummary = async () => {
    const res = await fetch(`${apiBaseUrl}/summary`);
    setSummary(await res.json());
  };

  const loadSpots = async () => {
    const res = await fetch(`${apiBaseUrl}/status`);
    setSpots(await res.json());
  };

  const refresh = async () => {
    await Promise.all([loadSummary(), loadSpots()]);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    await fetch(`${apiBaseUrl}/detections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm({ spot_code: '', name: '', status: 'available', confidence: 0.9 });
    await refresh();
  };

  return (
    <div className="app-container">
      <header>
        <h1>Gestión de Estacionamientos UBB</h1>
        <p>Dashboard React conectado a backend Node y Python</p>
      </header>

      <section className="summary-grid">
        <article className="card">
          <strong>{summary.total_spots}</strong>
          <span>Total de plazas</span>
        </article>
        <article className="card">
          <strong>{summary.occupied_count}</strong>
          <span>Ocupadas</span>
        </article>
        <article className="card">
          <strong>{summary.available_count}</strong>
          <span>Disponibles</span>
        </article>
        <article className="card">
          <strong>{formatDate(summary.last_updated)}</strong>
          <span>Última actualización</span>
        </article>
      </section>

      <section className="card section">
        <ParkingMap spots={spots} summary={summary} />
      </section>

      <section className="card section">
        <h2>Estado actual</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Confianza</th>
                <th>Última detección</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot.spot_code}>
                  <td>{spot.spot_code}</td>
                  <td>{spot.name}</td>
                  <td className={spot.status}>{STATUS_LABEL[spot.status]}</td>
                  <td>{spot.confidence != null ? spot.confidence.toFixed(2) : '-'}</td>
                  <td>{formatDate(spot.last_seen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card section">
        <h2>Enviar detección</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            placeholder="Código de plaza"
            value={form.spot_code}
            onChange={(e) => setForm({ ...form, spot_code: e.target.value })}
            required
          />
          <input
            placeholder="Nombre del sector"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="available">Disponible</option>
            <option value="occupied">Ocupado</option>
          </select>
          <input
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={form.confidence}
            onChange={(e) => setForm({ ...form, confidence: parseFloat(e.target.value) })}
          />
          <button type="submit" disabled={saving}>{saving ? 'Enviando...' : 'Enviar detección'}</button>
        </form>
      </section>
    </div>
  );
}

export default App;
