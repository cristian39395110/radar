import { Test, TestingModule } from '@nestjs/testing';
import { RadarsController } from './radars.controller';

describe('RadarsController', () => {
  let controller: RadarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RadarsController],
    }).compile();

    controller = module.get<RadarsController>(RadarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
