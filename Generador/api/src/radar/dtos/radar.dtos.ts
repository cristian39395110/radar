import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateRadarDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly model: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly neighborhood: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly sensorId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly radarId: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  readonly isActive: boolean;

  @IsNotEmpty()
  readonly location: string | number[];

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly maxSpeed: number;
}

export class UpdateRadarDto extends PartialType(CreateRadarDto) {}
