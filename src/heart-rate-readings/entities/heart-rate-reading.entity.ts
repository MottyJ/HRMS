import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class HeartRateReading {
  @PrimaryColumn('text')
  patientId: string;

  @Column('int')
  heartRate: number;

  @PrimaryColumn('timestamptz')
  timestamp: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;
}
