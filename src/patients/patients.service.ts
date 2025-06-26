import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RequestCountInterceptor } from 'src/common/interceptors/request-count.interceptor';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
  ) {}

  async create(dto: CreatePatientDto): Promise<Patient> {
    try {
      const patient = this.repo.create(dto);
      return await this.repo.save(patient);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to create patient', error.stack);
      } else {
        this.logger.error('Failed to create patient', String(error));
      }
      throw new InternalServerErrorException('Failed to create patient');
    }
  }

  async findAll(): Promise<Patient[]> {
    try {
      return await this.repo.find();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error('Failed to retrieve patients', error.stack);
      } else {
        this.logger.error('Failed to retrieve patients', String(error));
      }
      throw new InternalServerErrorException('Failed to retrieve patients');
    }
  }

  @UseInterceptors(RequestCountInterceptor)
  async findOne(id: string): Promise<Patient> {
    try {
      const patient = await this.repo.findOne({ where: { id } });
      if (!patient) {
        throw new NotFoundException(`Patient with id ${id} not found`);
      }
      return patient;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error('Failed to retrieve patient', error.stack);
      } else {
        this.logger.error('Failed to retrieve patient', String(error));
      }

      throw new InternalServerErrorException('Failed to retrieve patient');
    }
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    try {
      const result = await this.repo.update(id, dto);
      if (result.affected === 0) {
        throw new NotFoundException(`Patient with id ${id} not found`);
      }
      return await this.findOne(id);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error('Failed to update patient', error.stack);
      } else {
        this.logger.error('Failed to update patient', String(error));
      }

      throw new InternalServerErrorException('Failed to update patient');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.repo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Patient with id ${id} not found`);
      }
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        this.logger.error('Failed to delete patient', error.stack);
      } else {
        this.logger.error('Failed to delete patient', String(error));
      }

      throw new InternalServerErrorException('Failed to delete patient');
    }
  }
}
