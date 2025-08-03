/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { cats } from 'src/database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { CatDto } from 'src/modules/cats/dtos/cat.dto';
import { CreateCatDto } from 'src/modules/cats/dtos/create-cat.dto';
import { UpdateCatDto } from 'src/modules/cats/dtos/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private db: Schema,
  ) {}

  async getAll(): Promise<CatDto[]> {
    const result = await this.db.select()
      .from(cats)
      .where(eq(cats.isDeleted, false))
      .orderBy(desc(cats.createdAt));
    return result.map(row => new CatDto(row));
  }

  async getById(id: string): Promise<CatDto | null> {
    const result = await this.db.select()
      .from(cats)
      .where(and(eq(cats.id, id), eq(cats.isDeleted, false)));
    if (result.length === 0) throw new NotFoundException('Cat not found');
    return new CatDto(result[0]);
  }

  async create(data: CreateCatDto): Promise<CatDto> {
    const [created] = await this.db.insert(cats)
      .values({
        name: data.name,
        color: data.color,
      })
      .returning();
    return new CatDto(created);
  }

  async update(id: string, data: UpdateCatDto): Promise<CatDto> {
    const [updated] = await this.db.update(cats)
      .set({
        name: data.name,
        color: data.color,
      })
      .where(and(eq(cats.id, id), eq(cats.isDeleted, false)))
      .returning();
    if (!updated) throw new NotFoundException('Cat not found');
    return new CatDto(updated);
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await this.db.update(cats)
      .set({ isDeleted: true })
      .where(and(eq(cats.id, id), eq(cats.isDeleted, false)))
      .returning();
    if (!deleted) throw new NotFoundException('Cat not found');
    return true;
  }
}
