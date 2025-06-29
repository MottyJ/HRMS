# Heart Rate Service

NestJS + Fastify backend for managing patients and heart rate readings.

## Setup

Prerequisites:
- Node.js 16+
- PostgreSQL 
- Redis

```bash
git clone <repo-url>
cd hrms
npm install
cp .env.example .env
# Edit .env with your DB/Redis config
npm run seed
npm run start:dev
```

Server runs on http://localhost:3000/api/v1

## Environment

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=heart_rate_db
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API

### Patients
- `POST /patients` - Create patient
- `GET /patients` - List all patients  
- `GET /patients/:id` - Get patient (increments request counter)
- `PATCH /patients/:id` - Update patient
- `DELETE /patients/:id` - Delete patient
- `GET /patients/:id/requests` - Get request count from Redis

### Heart Rate Readings
All under `/patients/:id/heart-rate-readings`:
- `POST /` - Add reading
- `GET /` - List all readings
- `GET /high-heart-events` - Readings > 100 bpm
- `GET /analytics?from=2024-01-01&to=2024-01-31` - Stats for date range

## Tech Stack

- NestJS + Fastify (Chosen because it's almost double in speed than Express - https://www.techempower.com/benchmarks/#section=data-r23&l=zik0zj-pa5 )
- TypeORM + PostgreSQL (TypeORM simply because I'm used to Sequelize and wanted to do it differently - pg because it's the GOAT) 
- Redis (ioredis)
- class-validator for DTOs

## Notes

- Request counting uses Redis interceptor
- Seed script creates sample data
- Heart rate readings are append-only
- Global validation pipe + CORS enabled

## Testing (Only the default tests which Nest auto-generates are currently implemented)

```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests  
npm run test:watch  # Watch mode
```

## TODO

- [ ] Add Swagger docs
- [ ] More comprehensive tests
- [ ] Config validation
- [ ] Graceful shutdown
