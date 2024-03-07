import { Test, TestingModule } from '@nestjs/testing';
import { FunctionalUnitService } from './functional-unit.service';

describe('FunctionalUnitService', () => {
  let service: FunctionalUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunctionalUnitService],
    }).compile();

    service = module.get<FunctionalUnitService>(FunctionalUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
