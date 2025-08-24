import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { usersTable } from 'src/database/schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { and, eq } from 'drizzle-orm';


@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  async getAllUsers() {
    const user = await this.db.query.usersTable.findMany({
      where: (user, { eq }) => eq(user.isDeleted, false),
    });
    return user;
  }

  async getUserById(userId: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: (user, { eq, and }) =>
        and(eq(user.id, userId), eq(user.isDeleted, false)),
    });
    return user;
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const [created] = await this.db.insert(usersTable)
      .values({
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleName: data.roleName,
      })
      .returning();
    return created;
  }

  async update(id: string, data: UpdateUserDto) {
    const [updated] = await this.db.update(usersTable)
      .set({
        name: data.name,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleName: data.roleName,
      })
      .where(and(eq(usersTable.id, id), eq(usersTable.isDeleted, false)))
      .returning();
  }

  async delete(id: string) {
    const [deleted] = await this.db.update(usersTable)
      .set({ isDeleted: true })
      .where(eq(usersTable.id, id))
      .returning();
  }

}
