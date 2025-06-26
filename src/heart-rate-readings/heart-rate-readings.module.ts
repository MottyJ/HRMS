import { Module } from '@nestjs/common';
import { HeartRateReadingsService } from './heart-rate-readings.service';
import { HeartRateReadingsController } from './heart-rate-readings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeartRateReading } from './entities/heart-rate-reading.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeartRateReading])],
  controllers: [HeartRateReadingsController],
  providers: [HeartRateReadingsService],
})
export class HeartRateReadingsModule {}
