import { IsEmail, IsOptional, MinLength, IsIn } from 'class-validator';
import { UserRole } from 'src/modules/users/types/user-role'; 

export class UserUpdateDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsIn(['customer', 'owner', 'sales_rep', 'supplier'])
  @IsOptional()
  roleName?: UserRole;
}
