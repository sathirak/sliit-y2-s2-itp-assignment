import { Module } from '@nestjs/common';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
