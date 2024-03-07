import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateFunctionalUnit {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString({ each: true })
  @Length(6, 8, { each: true })
  @IsNotEmpty()
  readonly plates: string[];
  @IsString({ each: true })
  @IsOptional()
  readonly homeowner?: string;
}
