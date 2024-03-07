import {
  Neighborhood,
  NeighborhoodModel,
} from './../../entities/neighborhood.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsService } from './neighborhoods.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';

describe('NeighborhoodsService', () => {
  let service: NeighborhoodsService;
  const mockNeighborhoodModel = jest.fn();

  beforeEach(async () => {
    mockNeighborhoodModel.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NeighborhoodsService,
        {
          provide: getModelToken(Neighborhood.name),
          useValue: mockNeighborhoodModel,
        },
      ],
    }).compile();

    service = module.get<NeighborhoodsService>(NeighborhoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
