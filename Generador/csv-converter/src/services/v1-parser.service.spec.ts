import { Test, TestingModule } from '@nestjs/testing';
import { V1ParserService } from './v1-parser.service';

describe('V1ParserService', () => {
  let service: V1ParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [V1ParserService],
    }).compile();

    service = module.get<V1ParserService>(V1ParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
