/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatDto } from './dtos/cat.dto';
import { CreateCatDto } from './dtos/create-cat.dto';
import { UpdateCatDto } from './dtos/update-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async getAll(): Promise<CatDto[]> {
    return this.catsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<CatDto> {
    return this.catsService.getById(id);
  }

  @Post()
  async create(@Body() data: CreateCatDto): Promise<CatDto> {
    return this.catsService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCatDto): Promise<CatDto> {
    return this.catsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.catsService.delete(id);
    return { success: true };
  }
}
