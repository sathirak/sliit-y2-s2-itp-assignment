import { UserDto } from 'src/modules/user/dtos/user.dto';

declare global {
  namespace Express {
    interface Request {
      user: UserDto;
    }
  }
}

export type Nullable<T> = T | null;
