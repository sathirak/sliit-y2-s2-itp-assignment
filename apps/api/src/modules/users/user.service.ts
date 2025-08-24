import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';

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
        and(eq(user.userId, userId), eq(user.isDeleted, false)),
    });
    return user;
  }
}
