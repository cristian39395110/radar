import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodApiService } from './neighborhood-api.service';

describe('NeighborhoodApiService', () => {
  let service: NeighborhoodApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NeighborhoodApiService],
    }).compile();

    service = module.get<NeighborhoodApiService>(NeighborhoodApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
