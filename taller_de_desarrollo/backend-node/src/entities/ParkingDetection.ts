import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('parking_detections')
@Index(['spot_code'])
@Index(['timestamp'])
export class ParkingDetection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 32 })
  spot_code!: string;

  @Column({ type: 'varchar', length: 32 })
  status!: 'available' | 'occupied';

  @Column({ type: 'float', nullable: true })
  confidence?: number | null;

  @CreateDateColumn()
  timestamp!: Date;
}
