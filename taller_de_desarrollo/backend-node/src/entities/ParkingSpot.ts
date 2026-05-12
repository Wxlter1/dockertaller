import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('parking_spots')
@Index(['spot_code'], { unique: true })
export class ParkingSpot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  spot_code!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 32, default: 'available' })
  status!: 'available' | 'occupied';

  @Column({ type: 'float', nullable: true })
  confidence?: number | null;

  @Column({ type: 'timestamp', nullable: true })
  last_seen?: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
