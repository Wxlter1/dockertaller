import path from 'path';
import { DataSource } from 'typeorm';
import { ParkingSpot } from '../entities/ParkingSpot';
import { ParkingDetection } from '../entities/ParkingDetection';

const DB_TYPE = process.env.DB_TYPE || 'sqlite';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
const DB_USERNAME = process.env.DB_USERNAME || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_DATABASE = process.env.DB_DATABASE || 'parking';
const DB_SQLITE_PATH = process.env.DB_SQLITE_PATH || path.join(__dirname, '../../data/parking.db');

export const AppDataSource = new DataSource(
  DB_TYPE === 'postgres'
    ? {
        type: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: [ParkingSpot, ParkingDetection],
        migrations: [],
        subscribers: [],
      }
    : {
        type: 'sqlite',
        database: DB_SQLITE_PATH,
        synchronize: true,
        logging: false,
        entities: [ParkingSpot, ParkingDetection],
        migrations: [],
        subscribers: [],
      },
);
