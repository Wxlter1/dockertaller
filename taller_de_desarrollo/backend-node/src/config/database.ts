import path from 'path';
import { DataSource } from 'typeorm';
import { ParkingSpot } from '../entities/ParkingSpot';
import { ParkingDetection } from '../entities/ParkingDetection';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../data/parking.db'),
  synchronize: true,
  logging: false,
  entities: [ParkingSpot, ParkingDetection],
  migrations: [],
  subscribers: [],
});
