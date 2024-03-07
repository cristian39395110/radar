import { IsOptional, IsString } from 'class-validator';

export class CreateNeighborhoodApiDto {
  @IsOptional()
  @IsString()
  readonly accessin: string;
}
