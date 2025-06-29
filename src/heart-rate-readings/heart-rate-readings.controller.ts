import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { HeartRateReadingsService } from './heart-rate-readings.service';
import { CreateHeartRateReadingDto } from './dto/create-heart-rate-reading.dto';
import { RequestCountInterceptor } from 'src/common/interceptors/request-count.interceptor';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Controller('patients/:id/heart-rate-readings')
export class HeartRateReadingsController {
  constructor(
    private readonly heartRateReadingsService: HeartRateReadingsService,
  ) {}

  @Post()
  create(@Body() createHeartRateReadingDto: CreateHeartRateReadingDto) {
    return this.heartRateReadingsService.create(createHeartRateReadingDto);
  }

  @UseInterceptors(RequestCountInterceptor)
  @Get()
  findAll(@Param('id') patientId: string) {
    return this.heartRateReadingsService.findAll(patientId);
  }

  @UseInterceptors(RequestCountInterceptor)
  @Get('high-heart-events')
  getHighHeartEvents(@Param('id') patientId: string) {
    return this.heartRateReadingsService.findHighHeartEvents(patientId);
  }

  @UseInterceptors(RequestCountInterceptor)
  @Get('analytics')
  getAnalytics(
    @Param('id') patientId: string,
    @Query() query: AnalyticsQueryDto,
  ): Promise<AnalyticsResultDto> {
    return this.heartRateReadingsService.getAnalytics(
      patientId,
      new Date(query.from),
      new Date(query.to),
    );
  }
}
