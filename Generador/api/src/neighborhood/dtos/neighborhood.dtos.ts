import { CreateReportFieldsDto } from './reportFields.dtos';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateNeighborhoodApiDto } from './neighborhood-api.dtos';
import { Transform } from 'class-transformer';

export class CreateNeighborhoodDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly acronym: string;

  @ValidateNested()
  @IsNotEmpty()
  @ApiProperty()
  readonly reportFields: CreateReportFieldsDto;

  @IsNumber()
  @ApiPropertyOptional({
    default: 1,
  })
  readonly actNumber?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    default: false,
  })
  readonly sendToApi?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ default: true })
  readonly isActive?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ default: 'doppler' })
  readonly template?: string;

  @IsOptional()
  @ValidateNested()
  @ApiProperty()
  readonly tokens?: CreateNeighborhoodApiDto;
}

export class UpdateNeigborhoodDto extends PartialType(CreateNeighborhoodDto) {}

export class FindNeighborhoodDto {
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly t?: boolean;
}

export class UpdateWhiteListDto {
  @IsString({ each: true })
  @IsNotEmpty()
  readonly plates: string[];
}
