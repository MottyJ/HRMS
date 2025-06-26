import { Test, TestingModule } from '@nestjs/testing';
import { HeartRateReadingsController } from './heart-rate-readings.controller';
import { HeartRateReadingsService } from './heart-rate-readings.service';

describe('HeartRateReadingsController', () => {
  let controller: HeartRateReadingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeartRateReadingsController],
      providers: [HeartRateReadingsService],
    }).compile();

    controller = module.get<HeartRateReadingsController>(
      HeartRateReadingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
