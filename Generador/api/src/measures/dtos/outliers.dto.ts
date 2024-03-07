import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateOutlierDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly step?: boolean;
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  readonly speed?: boolean;
}
