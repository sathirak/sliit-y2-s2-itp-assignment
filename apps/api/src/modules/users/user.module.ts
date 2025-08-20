import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/users/user.controller';
import { UserService } from 'src/modules/users/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
