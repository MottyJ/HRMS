import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { HeartRateReading } from 'src/heart-rate-readings/entities/heart-rate-reading.entity';
import { Patient } from 'src/patients/entities/patient.entity';

async function ensureDatabaseExists(): Promise<void> {
  const admin = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres',
  });
  await admin.connect();

  const dbName = process.env.DB_NAME || 'heart_rate_db';
  const exists = await admin.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Created database "${dbName}"`);
  }

  await admin.end();
}

async function ensureSequenceExists(): Promise<void> {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'heart_rate_db',
  });
  await client.connect();

  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class
         WHERE relkind = 'S' AND relname = 'patients_id_seq'
      ) THEN
        CREATE SEQUENCE patients_id_seq
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;
      END IF;
    END
    $$;
  `);
  await client.end();
}

async function runSeed(): Promise<void> {
  await ensureDatabaseExists();

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'heart_rate_db',
    entities: [Patient, HeartRateReading],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
  
  await ensureSequenceExists();

  await dataSource.synchronize();

  const patientRepo = dataSource.getRepository(Patient);
  const [alice, bob] = await patientRepo.save([
    { id: '1', name: 'Alice Johnson', age: 34, gender: 'female' },
    { id: '2', name: 'Bob Smith', age: 45, gender: 'male' },
  ]);

  await dataSource.query(`
    SELECT setval(
      'patients_id_seq',
      (SELECT MAX((id)::bigint) FROM "patient")
    );
  `);

  const hrRepo = dataSource.getRepository(HeartRateReading);
  await hrRepo.save([
    { patient: alice, timestamp: new Date('2024-03-01T08:00:00Z'), heartRate: 85 },
    { patient: alice, timestamp: new Date('2024-03-01T10:30:00Z'), heartRate: 101 },
    { patient: alice, timestamp: new Date('2024-03-01T13:45:00Z'), heartRate: 97 },
    { patient: bob, timestamp: new Date('2024-03-02T09:15:00Z'), heartRate: 88 },
    { patient: bob, timestamp: new Date('2024-03-02T11:00:00Z'), heartRate: 105 },
    { patient: bob, timestamp: new Date('2024-03-02T14:20:00Z'), heartRate: 93 },
  ]);

  await dataSource.destroy();
  console.log('Seeding complete.');
}

runSeed().catch(error => {
  console.error('Seeding failed:', error);
  process.exit(1);
});