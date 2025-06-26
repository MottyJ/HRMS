import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RequestCountInterceptor } from 'src/common/interceptors/request-count.interceptor';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import type { Redis } from 'ioredis';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @UseInterceptors(RequestCountInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }

  @Get(':id/requests')
  async getRequestCount(@Param('id') id: string) {
    const raw = await this.redis.get(`patient:request_count:${id}`);
    const requests = raw !== null ? parseInt(raw, 10) || 0 : 0;
    return { patientId: id, requests };
  }
}
