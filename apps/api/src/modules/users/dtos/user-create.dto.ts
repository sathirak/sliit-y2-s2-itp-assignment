import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';
import { UserRole } from 'src/modules/users/types/user-role';

export class UserCreateDto {
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

  @IsIn(['customer', 'owner', 'sales_rep', 'supplier'])
  roleName: UserRole;
}
