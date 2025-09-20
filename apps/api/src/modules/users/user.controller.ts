import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from 'src/common/decorates/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getAllUsers(): Promise<UserDto[]> {
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
  async create(@Body() data: CreateUserDto): Promise<UserDto> {
    return this.userService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}



