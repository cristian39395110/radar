import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResidentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  readonly plates: string[];
}
