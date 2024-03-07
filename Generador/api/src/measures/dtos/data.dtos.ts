import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDataDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Object speed in Km/h' })
  readonly speed: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ description: 'Sample Date' })
  readonly date: Date;

  @IsNumber()
  @ApiProperty()
  readonly distance: number;

  @IsNumber()
  @ApiProperty()
  readonly magnitude: number;

  @IsNumber()
  @ApiProperty()
  readonly angle: number;
}
