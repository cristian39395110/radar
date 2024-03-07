import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateReportFieldsDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly date: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly plate: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly actNumber: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly speed: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly neighborhood: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly location: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly src: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly funtionalUnit: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly homeowner: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly id: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly model: boolean;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly sensorId: boolean;
}

export class UpdateReportFieldsDto extends PartialType(CreateReportFieldsDto) {}
