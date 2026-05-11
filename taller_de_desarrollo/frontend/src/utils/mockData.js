export function generateMockParkingSpots() {
  const sectors = ['A', 'B', 'C', 'D', 'E', 'F'];
  const spots = [];

  sectors.forEach((sector) => {
    const spotsPerSector = [45, 60, 35, 40, 100, 50][sectors.indexOf(sector)];
    for (let i = 1; i <= 10; i++) {
      const isOccupied = Math.random() > 0.6;
      spots.push({
        spot_code: `${sector}${i}`,
        name: `${sector}-${i}`,
        status: isOccupied ? 'occupied' : 'available',
        confidence: 0.85 + Math.random() * 0.15,
        last_seen: new Date().toISOString(),
      });
    }
  });

  return spots;
}

export function getOccupationPercentage(spots, sectorId) {
  const sectorSpots = spots.filter((spot) => spot.spot_code.charAt(0) === sectorId);
  if (sectorSpots.length === 0) return 0;
  const occupied = sectorSpots.filter((spot) => spot.status === 'occupied').length;
  return Math.round((occupied / sectorSpots.length) * 100);
}
