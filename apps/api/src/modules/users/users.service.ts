import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from 'src/modules/users/dtos/signup.dto';
import { SigninDto } from 'src/modules/users/dtos/signin.dto';
import { User } from 'src/modules/users/models/user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
	private users: User[] = [];

	async signup(data: SignupDto): Promise<Omit<User, 'password'>> {
		const exists = this.users.find(u => u.email === data.email);
		if (exists) throw new ConflictException('Email already in use');
		const hashed = await bcrypt.hash(data.password, 10);
		const user: User = {
			id: (this.users.length + 1).toString(),
			email: data.email,
			username: data.username,
			password: hashed,
		};
		this.users.push(user);
		const { password, ...rest } = user;
		return rest;
	}

	async signin(data: SigninDto): Promise<{ accessToken: string }> {
		const user = this.users.find(u => u.email === data.email);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		const valid = await bcrypt.compare(data.password, user.password);
		if (!valid) throw new UnauthorizedException('Invalid credentials');
		const accessToken = jwt.sign({ sub: user.id, email: user.email }, 'SECRET', { expiresIn: '1h' });
		return { accessToken };
	}
}
