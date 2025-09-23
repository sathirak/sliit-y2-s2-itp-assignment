import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, ForbiddenException } from '@nestjs/common';
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
    if (currentUser && currentUser.roleName === 'owner') {
      return this.userService.getAllUsers();
    } else {
      throw new ForbiddenException('Only owners can access all users');
    }
  }

  @Get('search')
  async searchUsers(@Query('q') searchQuery: string, @CurrentUser() currentUser: UserDto): Promise<UserDto[]> {
    if (currentUser && currentUser.roleName === 'owner') {
      if (!searchQuery) {
        return [];
      }
      return this.userService.searchUsers(searchQuery);
    } else {
      throw new ForbiddenException('Only owners can search users');
    }
  }

  @Get("me")
  async me(@CurrentUser() currentUser: UserDto): Promise<UserDto> {
    return currentUser;
  }

  @Get(":id")
  async getUserById(@Param('id') id: string, @CurrentUser() currentUser: UserDto): Promise<UserDto> {
    // Allow users to get their own profile, or owners to get any user
    if (currentUser.id !== id && currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Access denied');
    }
    return this.userService.getUserById(id);
  }

  @Post()
  async create(@Body() data: CreateUserDto, @CurrentUser() currentUser: UserDto): Promise<UserDto> {
    // Check if current user has owner role for creating users manually
    if (currentUser && currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owners can create users');
    }
    return this.userService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto, @CurrentUser() currentUser: UserDto) {
    return this.userService.update(id, data, currentUser);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() currentUser: UserDto) {
    return this.userService.delete(id, currentUser);
  }
}



