export const CAMPUS_SECTORS = [
  {
    id: 'A',
    name: 'Sector A - Administrativo',
    x: 50,
    y: 100,
    width: 200,
    height: 150,
    spots: 45,
  },
  {
    id: 'B',
    name: 'Sector B - Edificios Académicos',
    x: 300,
    y: 100,
    width: 220,
    height: 150,
    spots: 60,
  },
  {
    id: 'C',
    name: 'Sector C - Biblioteca',
    x: 600,
    y: 100,
    width: 180,
    height: 150,
    spots: 35,
  },
  {
    id: 'D',
    name: 'Sector D - Deportes',
    x: 50,
    y: 320,
    width: 200,
    height: 160,
    spots: 40,
  },
  {
    id: 'E',
    name: 'Sector E - Estacionamiento Principal',
    x: 300,
    y: 320,
    width: 250,
    height: 160,
    spots: 100,
  },
  {
    id: 'F',
    name: 'Sector F - Visitantes',
    x: 600,
    y: 320,
    width: 180,
    height: 160,
    spots: 50,
  },
];

export const spotCodesForSector = (sectorId) => {
  return Array.from({ length: 10 }, (_, i) => `${sectorId}${i + 1}`);
};
