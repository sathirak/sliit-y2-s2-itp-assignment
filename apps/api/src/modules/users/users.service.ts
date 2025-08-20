import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SignupDto } from 'src/modules/users/dtos/signup.dto';
import { SigninDto } from 'src/modules/users/dtos/signin.dto';
import { User } from 'src/modules/users/models/user.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
	private users: User[] = [];
	private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

	private validateEmail(email: string): void {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new BadRequestException('Invalid email format');
		}
	}

	private generateUserId(): string {
		const timestamp = Date.now();
		const random = Math.floor(Math.random() * 1000);
		return `${timestamp}-${random}`;
	}

	async signup(data: SignupDto): Promise<Omit<User, 'password'>> {
		try {
			this.validateEmail(data.email);
			const exists = this.users.find(u => u.email === data.email.toLowerCase());
			if (exists) throw new ConflictException('Email already in use');
			
			const hashed = await bcrypt.hash(data.password, 10);
			const user: User = {
				id: this.generateUserId(),
				email: data.email.toLowerCase().trim(),
				username: data.username.trim(),
				password: hashed,
			};
			this.users.push(user);
			const { password, ...rest } = user;
			return rest;
		} catch (error) {
			if (error instanceof ConflictException || error instanceof BadRequestException) throw error;
			throw new BadRequestException('Failed to create user');
		}
	}

	async signin(data: SigninDto): Promise<{ accessToken: string }> {
		try {
			this.validateEmail(data.email);
			const user = this.users.find(u => u.email === data.email.toLowerCase());
			if (!user) throw new UnauthorizedException('Invalid credentials');
			
			const valid = await bcrypt.compare(data.password, user.password);
			if (!valid) throw new UnauthorizedException('Invalid credentials');
			
			const accessToken = jwt.sign(
				{ sub: user.id, email: user.email },
				this.JWT_SECRET,
				{ expiresIn: '1h' }
			);
			return { accessToken };
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof BadRequestException) throw error;
			throw new BadRequestException('Failed to sign in');
		}
	}
}
