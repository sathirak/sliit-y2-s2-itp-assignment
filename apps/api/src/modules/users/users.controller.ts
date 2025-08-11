import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { SignupDto } from 'src/modules/users/dtos/signup.dto';
import { SigninDto } from 'src/modules/users/dtos/signin.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('signup')
	async signup(@Body() data: SignupDto) {
		return this.usersService.signup(data);
	}

	@Post('signin')
	async signin(@Body() data: SigninDto) {
		return this.usersService.signin(data);
	}
}
