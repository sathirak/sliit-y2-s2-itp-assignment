import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsDate,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../interfaces/roles.enum';

export class UserDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  roleName: UserRole;

  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  isDeleted: boolean;
}
