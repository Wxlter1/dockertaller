import { useEffect, useMemo, useState } from 'react';

function ParkingMap({ spots, summary }) {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const loadSectors = async () => {
      const res = await fetch('/api/parking/sectors/summary');
      setSectors(await res.json());
    };
    loadSectors();
  }, [spots]);

  const getColor = (occupancyPercentage) => {
    const pct = parseFloat(occupancyPercentage) || 0;
    if (pct >= 90) return '#dc2626';
    if (pct >= 70) return '#f97316';
    if (pct >= 50) return '#eab308';
    if (pct >= 30) return '#84cc16';
    return '#16a34a';
  };

  const sectorMap = {
    A: { x: 50, y: 100, width: 200, height: 150 },
    B: { x: 300, y: 100, width: 220, height: 150 },
    C: { x: 600, y: 100, width: 180, height: 150 },
    D: { x: 50, y: 320, width: 200, height: 160 },
    E: { x: 300, y: 320, width: 250, height: 160 },
    F: { x: 600, y: 320, width: 180, height: 160 },
  };

  return (
    <div className="map-container">
      <h2>Mapa del Campus UBB - Concepción</h2>
      <svg viewBox="0 0 850 550" className="campus-map">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="850" height="550" fill="url(#grid)" />

        {Object.entries(sectorMap).map(([sectorId, coords]) => {
          const sectorData = sectors.find((s) => s.sector === sectorId);
          const color = sectorData ? getColor(sectorData.occupancy_percentage) : '#e5e7eb';

          return (
            <g key={sectorId}>
              <rect
                x={coords.x}
                y={coords.y}
                width={coords.width}
                height={coords.height}
                fill={color}
                stroke="#1f2937"
                strokeWidth="2"
              />
              <text
                x={coords.x + coords.width / 2}
                y={coords.y + coords.height / 2 - 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="white"
              >
                Sector {sectorId}
              </text>
              {sectorData && (
                <text
                  x={coords.x + coords.width / 2}
                  y={coords.y + coords.height / 2 + 15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="white"
                >
                  {sectorData.available}/{sectorData.total} ({sectorData.occupancy_percentage}%)
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="legend">
        <h3>Legenda de Ocupación</h3>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#16a34a' }}></span>
          <span>0-30% ocupación</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#84cc16' }}></span>
          <span>30-50% ocupación</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#eab308' }}></span>
          <span>50-70% ocupación</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f97316' }}></span>
          <span>70-90% ocupación</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#dc2626' }}></span>
          <span>90-100% ocupación (Lleno)</span>
        </div>
      </div>
    </div>
  );
}

export default ParkingMap;
