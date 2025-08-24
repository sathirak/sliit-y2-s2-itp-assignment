import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }
   
  @Get(":id")
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUserById(id);
  }
}





