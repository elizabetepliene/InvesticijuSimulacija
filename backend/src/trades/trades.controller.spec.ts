import { Test, TestingModule } from '@nestjs/testing';
import { TradesController } from './trades.controller.js';
import { TradesService } from './trades.service.js';

describe('TradesController', () => {
  let controller: TradesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradesController],
      providers: [TradesService],
    }).compile();

    controller = module.get<TradesController>(TradesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
