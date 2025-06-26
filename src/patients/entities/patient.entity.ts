import { Column, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryColumn('text', { default: () => "nextval('patients_id_seq')::text" })
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
  })
  @Column()
  gender: string;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
