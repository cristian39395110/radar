import { Test, TestingModule } from '@nestjs/testing';
import { CsvConverterService } from './csv-converter.service';

describe('CsvConverterService', () => {
  let service: CsvConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvConverterService],
    }).compile();

    service = module.get<CsvConverterService>(CsvConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
