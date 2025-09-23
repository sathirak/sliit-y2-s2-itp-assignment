import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsDate,
  IsEnum,
  IsUUID,
  IsString,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../interfaces/roles.enum';

export class UserDto {
  constructor(partial: UserDto) {
    Object.assign(this, partial);
  }
  @IsUUID()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  roleName: UserRole;

  @IsDate()
  createdAt: Date;

  @IsBoolean()
  isDeleted: boolean;
}
