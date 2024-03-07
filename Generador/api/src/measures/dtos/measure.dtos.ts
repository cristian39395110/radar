import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateKldSample } from './sample.dtos';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOutlierDto } from './outliers.dto';

export class CreateMeasureDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  radar: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'video uuid' })
  video: string;
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  samples: CreateKldSample[];
  @IsBoolean()
  @ApiProperty({ description: 'Report is completed', default: false })
  isCompleted?: boolean;
  @IsOptional()
  @ApiProperty()
  outliers?: CreateOutlierDto;
  @IsOptional()
  @IsDate()
  @ApiProperty()
  date?: Date;
}

export class CreateMeasureWithCsvDto extends OmitType(CreateMeasureDto, [
  'samples',
  'video',
  'isCompleted',
]) {}

export class AddPlateDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @ApiProperty()
  readonly security: number;
  @IsNotEmpty()
  @IsString()
  @Length(6, 7)
  @ApiProperty()
  readonly plate: string;
  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'Imagen por defecto que se sellecionara a la hora de crear el reporte',
  })
  readonly pic: string;
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Se encontro más de un vehiculo en el video',
  })
  readonly moreThanOneCar: boolean;
}

export class UpdateMeasureDto extends PartialType(CreateMeasureDto) {}

export class TimeFilter {
  @IsDate()
  @IsNotEmpty()
  readonly start: Date;
  @IsDate()
  @IsNotEmpty()
  readonly end: Date;
}

export class FilterMeasureDto {
  @IsBoolean()
  @IsOptional()
  readonly plate?: boolean;
  @IsBoolean()
  @IsOptional()
  readonly isCompleted?: boolean;
  @IsBoolean()
  @IsOptional()
  readonly isDiscarded?: boolean;
  @IsOptional()
  @IsMongoId({ each: true })
  readonly radars?: string[];
  @IsMongoId()
  @IsOptional()
  readonly neighborhood?: string;
  @IsBoolean()
  @IsOptional()
  readonly asc?: boolean;
  @ValidateNested()
  @IsOptional()
  readonly time?: TimeFilter;
  @IsOptional()
  readonly isCorrupted?: boolean;
}
