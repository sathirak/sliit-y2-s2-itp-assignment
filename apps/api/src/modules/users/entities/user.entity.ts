import { UserRole } from 'src/modules/users/types/user-role';

export class UserEntity {
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: UserRole;
}
