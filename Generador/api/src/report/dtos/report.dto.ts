import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateSrcDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly car: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly domain: string;
}

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  readonly actNumber: number;
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  readonly date: Date;
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(7)
  @ApiProperty()
  readonly plate: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly speed: number;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly functionalUntil: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly homeowner: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly location: string;
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly neighborhood: string;
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly radar: string;
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  readonly measure: string;
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  readonly src: CreateSrcDto;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  readonly wasSent: boolean;
}

export class ReportQueryFilter {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly offset?: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly limit: number;
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  readonly neighborhood?: string;
  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly start: Date;
  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly end: Date;
  @IsIn(['measure', 'generation'])
  @IsOptional()
  @ApiProperty()
  readonly mode?: 'measure' | 'generation';
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  @Transform((v) => v.value === 'true')
  readonly wasSent?: boolean;
}

export class SentToAccessinDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty()
  readonly ids: string[];
}
