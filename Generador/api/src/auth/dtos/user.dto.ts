import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLES, Role } from '../decorators/user.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class SingUpDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;
  @IsArray()
  @IsOptional()
  readonly roles?: Role[];
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  readonly password: string;
}
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @ApiProperty()
  readonly oldPassword: string;
  @IsString()
  @MinLength(8)
  @ApiProperty()
  readonly password: string;
}

export class UpdateUserByAdminDto {
  @IsIn(ROLES)
  @IsOptional()
  readonly role: Role;
  @IsString()
  @MinLength(8)
  @IsOptional()
  readonly password: string;
}
