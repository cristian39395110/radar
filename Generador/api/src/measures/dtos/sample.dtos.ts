import { CreateDataDto } from './data.dtos';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKldSample {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @ApiProperty()
  readonly pdat: CreateDataDto[];

  @IsOptional()
  @ValidateNested()
  @ApiProperty()
  readonly tdat: CreateDataDto;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly isRecommended: boolean;
}
