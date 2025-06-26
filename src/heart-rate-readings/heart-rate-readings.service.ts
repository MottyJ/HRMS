import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { HeartRateReading } from './entities/heart-rate-reading.entity';
import { CreateHeartRateReadingDto } from './dto/create-heart-rate-reading.dto';
import { AnalyticsResultDto } from './dto/analytics-result.dto';

@Injectable()
export class HeartRateReadingsService {
  private readonly logger = new Logger(HeartRateReadingsService.name);

  constructor(
    @InjectRepository(HeartRateReading)
    private readonly repo: Repository<HeartRateReading>,
  ) {}

  async create(dto: CreateHeartRateReadingDto): Promise<HeartRateReading> {
    try {
      const reading = this.repo.create(dto);
      return await this.repo.save(reading);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create heart rate reading', error.stack);
      } else {
        this.logger.error('Failed to create heart rate reading', String(error));
      }
      throw new InternalServerErrorException(
        'Failed to create heart rate reading',
      );
    }
  }

  async findAll(patientId: string): Promise<HeartRateReading[]> {
    try {
      return await this.repo.find({ where: { patient: { id: patientId } } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          'Failed to retrieve heart rate readings',
          error.stack,
        );
      } else {
        this.logger.error(
          'Failed to retrieve heart rate readings',
          String(error),
        );
      }
      throw new InternalServerErrorException(
        'Failed to retrieve heart rate readings',
      );
    }
  }

  async findHighHeartEvents(patientId: string): Promise<HeartRateReading[]> {
    try {
      return await this.repo.find({
        where: {
          patient: { id: patientId },
          heartRate: MoreThan(100),
        },
        order: { timestamp: 'ASC' },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          'Failed to retrieve high heart rate events',
          error.stack,
        );
      } else {
        this.logger.error(
          'Failed to retrieve high heart rate events',
          String(error),
        );
      }
      throw new InternalServerErrorException(
        'Failed to retrieve high heart rate events',
      );
    }
  }

  async getAnalytics(
    patientId: string,
    from: Date,
    to: Date,
  ): Promise<AnalyticsResultDto> {
    try {
      const raw = await this.repo
        .createQueryBuilder('hr')
        .select('AVG(hr.heartRate)', 'avg')
        .addSelect('MIN(hr.heartRate)', 'min')
        .addSelect('MAX(hr.heartRate)', 'max')
        .where('hr.patientId = :patientId', { patientId })
        .andWhere('hr.timestamp BETWEEN :from AND :to', { from, to })
        .getRawOne<{
          avg: string | null;
          min: string | null;
          max: string | null;
        }>();

      const avgStr = raw?.avg ?? '0';
      const minStr = raw?.min ?? '0';
      const maxStr = raw?.max ?? '0';

      return {
        average: parseFloat(avgStr),
        minimum: parseInt(minStr, 10),
        maximum: parseInt(maxStr, 10),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to compute analytics', error.stack);
      } else {
        this.logger.error('Failed to compute analytics', String(error));
      }
      throw new InternalServerErrorException('Failed to compute analytics');
    }
  }
}
