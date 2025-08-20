import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/modules/users/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/users/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules/users/user.service';
import { UserCreateDto } from 'src/modules/users/dtos/user-create.dto';
import { UserUpdateDto } from 'src/modules/users/dtos/user-update.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('admin')
  async create(@Body() data: UserCreateDto, @Request() req) {
    // Only admin can create users
    return this.userService.addUser(data);
  }

  @Get()
  @Roles('admin', 'sales_rep')
  async findAll(@Request() req) {
    // Only admin and sales_rep can view all users
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  @Roles('admin', 'customer', 'sales_rep', 'supplier')
  async findOne(@Param('userId') userId: string, @Request() req) {
    // All roles can view their own user info
    return this.userService.getUserById(userId);
  }

  @Put(':userId')
  @Roles('admin', 'customer', 'sales_rep', 'supplier')
  async update(@Param('userId') userId: string, @Body() data: UserUpdateDto, @Request() req) {
    // All roles can update their own info
    return this.userService.modifyUser(userId, data);
  }

  @Delete(':userId')
  @Roles('admin')
  async remove(@Param('userId') userId: string, @Request() req) {
    // Only admin can delete users
        return this.userService.deleteUser(userId);
      }
    }