import { Test, TestingModule } from '@nestjs/testing';
import { HeartRateReadingsService } from './heart-rate-readings.service';

describe('HeartRateReadingsService', () => {
  let service: HeartRateReadingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeartRateReadingsService],
    }).compile();

    service = module.get<HeartRateReadingsService>(HeartRateReadingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
