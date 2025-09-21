import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/common/decorates/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getAllUsers(@CurrentUser() currentUser: UserDto): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }

  @Get("me")
  async me(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return currentUser;
  }

  @Get(":id")
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUserById(id);
  }

  @Post()
  async create(@CurrentUser() currentUser: UserDto, @Body() data: CreateUserDto): Promise<UserDto> {
    if (currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owner can create users');
    }
    return this.userService.create(data);
  }

  @Put(':id')
  async update(@CurrentUser() currentUser: UserDto, @Param('id') id: string, @Body() data: UpdateUserDto) {
    if (currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owner can update users');
    }
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@CurrentUser() currentUser: UserDto, @Param('id') id: string) {
    if (currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owner can delete users');
    }
    return this.userService.delete(id);
  }
}



