import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/modules/users/user.service';
import { UserDto } from 'src/modules/users/dtos/user.dto';
import { UserRole } from 'src/modules/users/interfaces/roles.enum';
import { IS_ALLOW_GUESTS } from '../decorates/allow-guests.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly authService: UserService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const isAllowGuests = this.reflector.getAllAndOverride<boolean>(
        IS_ALLOW_GUESTS,
        [context.getHandler(), context.getClass()],
      );

      if (isAllowGuests) {
        return this.authorizeWithGuests(req);
      }

      return this.validateRequest(req);
    } catch (error) {
      this.logger.error('Error in JwtGuard', error);
      return false;
    }
  }

  async validateRequest(req: Request) {
    const authHeader = req.header('authorization');

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const [method, token] = authHeader.split(' ');

    if (method !== 'Bearer' || !token || (token && token.trim() === '')) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.getUserBySupabaseId(token);
    if (!user) {
      return false;
    }

    req.user = user;
    return true;
  }

  async authorizeWithGuests(req: Request) {
    try {
      const result = await this.validateRequest(req);
      return result;
    } catch {
      const guest: UserDto = {
        id: 'guest',
        email: '',
        firstName: 'Guest',
        lastName: '',
        createdAt: new Date(),
        name: 'Guest',
        password: '',
        roleName: UserRole.CUSTOMER,
        isDeleted: false,
      };
      req.user = guest;
      return true;
    }
  }
}
