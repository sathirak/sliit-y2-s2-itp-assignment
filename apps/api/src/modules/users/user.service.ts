import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { UserCreateDto } from 'src/modules/users/dtos/user-create.dto';
import { UserUpdateDto } from 'src/modules/users/dtos/user-update.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private userList: UserEntity[] = [];

  private validateUserId(userId: string) {
    if (!userId?.trim() || !/^[\w-]+$/.test(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }
  }

  private validateEmail(email: string, excludeUserId?: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (this.userList.some(u => u.email === email && u.userId !== excludeUserId)) {
      throw new ConflictException('Email already registered');
    }
  }

  private generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
  }

  async addUser(data: UserCreateDto): Promise<Omit<UserEntity, 'password'>> {
    try {
      this.validateEmail(data.email);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser: UserEntity = {
        userId: this.generateUserId(),
        name: data.name.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        roleName: data.roleName,
      };
      this.userList.push(newUser);
      const { password, ...userInfo } = newUser;
      return userInfo;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create user');
    }
  }

  async getAllUsers(): Promise<Omit<UserEntity, 'password'>[]> {
    try {
      return this.userList.map(({ password, ...info }) => info);
    } catch (error) {
      throw new BadRequestException('Failed to fetch users');
    }
  }

  async getUserById(userId: string): Promise<Omit<UserEntity, 'password'>> {
    try {
      this.validateUserId(userId);
      const user = this.userList.find(u => u.userId === userId);
      if (!user) throw new NotFoundException('User not found');
      const { password, ...info } = user;
      return info;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to fetch user');
    }
  }

  async modifyUser(userId: string, data: UserUpdateDto): Promise<Omit<UserEntity, 'password'>> {
    try {
      this.validateUserId(userId);
      const user = this.userList.find(u => u.userId === userId);
      if (!user) throw new NotFoundException('User not found');
      
      if (data.email) {
        this.validateEmail(data.email, userId);
        user.email = data.email.toLowerCase().trim();
      }
      if (data.name) user.name = data.name.trim();
      if (data.firstName) user.firstName = data.firstName.trim();
      if (data.lastName) user.lastName = data.lastName.trim();
      if (data.roleName) user.roleName = data.roleName;
      if (data.password) {
        user.password = await bcrypt.hash(data.password, 10);
      }
      
      const { password, ...info } = user;
      return info;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    try {
      this.validateUserId(userId);
      const index = this.userList.findIndex(u => u.userId === userId);
      if (index === -1) throw new NotFoundException('User not found');
      this.userList.splice(index, 1);
      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to delete user');
    }
  }
}
