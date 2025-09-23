import { Injectable, Inject, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { userProviders, usersTable } from 'src/database/schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { and, eq, or, ilike } from 'drizzle-orm';
import { verifyJwt } from 'src/common/utils/jwt';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import * as schema from 'src/database/schema';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
    private configService: ConfigService,
  ) {}

  async getAllUsers() {
    const user = await this.db.query.usersTable.findMany({
      where: (user, { eq }) => eq(user.isDeleted, false),
    });
    return user;
  }

  async searchUsers(searchQuery: string) {
    const users = await this.db.query.usersTable.findMany({
      where: (user, { eq, and, or, ilike }) =>
        and(
          eq(user.isDeleted, false),
          or(
            ilike(user.firstName, `%${searchQuery}%`),
            ilike(user.lastName, `%${searchQuery}%`),
            ilike(user.email, `%${searchQuery}%`)
          )
        ),
    });
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.db.query.usersTable.findFirst({
      where: (user, { eq, and }) =>
        and(eq(user.id, userId), eq(user.isDeleted, false)),
    });
    return user;
  }

  async getUserBySupabaseId(token: string): Promise<UserDto | null> {
    let decodedToken;
    try {
      decodedToken = await verifyJwt<Omit<SupabaseUser, 'identities'>>(
        token,
        this.configService.get<string>('JWT_SECRET'),
      );
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException();
    }

    const providerId = decodedToken.sub;
    try {
      const userProvider = await this.db.query.userProviders.findFirst({
        where: and(
          eq(schema.userProviders.providerId, providerId),
          eq(schema.userProviders.provider, 'supabase'),
        ),
        with: {
          user: true,
        },
      });

      if (!userProvider || !userProvider.user) {
        const userMeta = decodedToken.user_metadata || {};

        
        const fullName = userMeta.full_name || '';
        const [firstName, ...lastNameParts] = fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        const createdUser = await this.createUser({
          id: providerId,
          email: decodedToken.email,
          firstName: firstName || '',
          lastName: lastName || '',
          rawUserMetaData: userMeta,
        });
        return new UserDto(createdUser);
      }

      return new UserDto(userProvider.user);
    } catch (error) {
      throw error;
    }
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const [created] = await this.db.insert(usersTable)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleName: data.roleName,
      })
      .returning();
    return created;
  }

  async update(id: string, data: UpdateUserDto, currentUser: UserDto) {
    if (currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owners can update users');
    }

    const [updated] = await this.db.update(usersTable)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleName: data.roleName,
      })
      .where(and(eq(usersTable.id, id), eq(usersTable.isDeleted, false)))
      .returning();
    
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    
    return updated;
  }

  async delete(id: string, currentUser: UserDto) {
    // Check if current user has owner role
    if (currentUser.roleName !== 'owner') {
      throw new ForbiddenException('Only owners can delete users');
    }

    const [deleted] = await this.db.update(usersTable)
      .set({ isDeleted: true })
      .where(eq(usersTable.id, id))
      .returning();
    
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
    
    return deleted;
  }

  async createUser(userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    rawUserMetaData: any;
  }) {
    try {
      if (!userData.id || !userData.email) {
        throw new Error('Missing required user data: id or email');
      }

      const firstName = userData.firstName;
      const lastName = userData.lastName;

      const user = await this.db.transaction(async (tx) => {
        const [createdUser] = await tx
          .insert(usersTable)
          .values({
            firstName: firstName,
            lastName: lastName,
            email: userData.email,
            roleName: 'customer',
            isDeleted: false
          } as any)
          .returning();

        await tx.insert(userProviders).values({
          providerId: userData.id,
          userId: createdUser.id,
          provider: 'supabase',
        });

        return createdUser;
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
