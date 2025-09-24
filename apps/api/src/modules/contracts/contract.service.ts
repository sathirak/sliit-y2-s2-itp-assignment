import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { contracts } from './models/contract.model';
import { contractRequests } from './models/contract-request.model';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CreateContractRequestDto } from './dtos/create-contract-request.dto';
import { UpdateContractRequestDto } from './dtos/update-contract-request.dto';
import { ContractFilterDto } from './dtos/contract-filter.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { PaginationUtil } from '../../common/utils/pagination.util';
import { eq, and, gte, lte, sql, like, or, desc } from 'drizzle-orm';
import { UserRole } from '../users/interfaces/roles.enum';

@Injectable()
export class ContractService {
  constructor(
    @Inject(DatabaseAsyncProvider)
    private readonly db: Schema,
  ) {}

  // Contract CRUD operations
  async create(createContractDto: CreateContractDto, ownerId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can create contracts');
    }

    const [contract] = await this.db.insert(contracts)
      .values({
        ...createContractDto,
        ownerId,
        updatedAt: new Date(),
      })
      .returning();
    return contract;
  }

  async findAll(filters: ContractFilterDto, userId: string, userRole: UserRole): Promise<PaginatedResponseDto<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      title,
      ownerId,
      minAmount,
      maxAmount,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    } = filters;

    // Build where clause with role-based filtering
    const additionalFilters: any[] = [eq(contracts.deleted, false)];

    // Role-based access control - simplified since contracts don't have suppliers anymore
    if (userRole === UserRole.OWNER) {
      // Owners can only see contracts where they are the owner
      additionalFilters.push(eq(contracts.ownerId, userId));
    }
    // Note: Suppliers will now view contracts through contract requests

    // Add search functionality
    if (search) {
      const searchConditions = [
        like(contracts.title, `%${search}%`),
        like(contracts.description, `%${search}%`),
      ];
      additionalFilters.push(or(...searchConditions));
    }

    // Add specific filters
    if (title) {
      additionalFilters.push(like(contracts.title, `%${title}%`));
    }
    if (ownerId) {
      additionalFilters.push(eq(contracts.ownerId, ownerId));
    }
    if (minAmount !== undefined) {
      additionalFilters.push(gte(sql`CAST(${contracts.amount} AS DECIMAL)`, parseFloat(minAmount)));
    }
    if (maxAmount !== undefined) {
      additionalFilters.push(lte(sql`CAST(${contracts.amount} AS DECIMAL)`, parseFloat(maxAmount)));
    }
    if (startDateFrom) {
      additionalFilters.push(gte(sql`CAST(${contracts.startDate} AS DATE)`, startDateFrom));
    }
    if (startDateTo) {
      additionalFilters.push(lte(sql`CAST(${contracts.startDate} AS DATE)`, startDateTo));
    }
    if (endDateFrom) {
      additionalFilters.push(gte(sql`CAST(${contracts.endDate} AS DATE)`, endDateFrom));
    }
    if (endDateTo) {
      additionalFilters.push(lte(sql`CAST(${contracts.endDate} AS DATE)`, endDateTo));
    }

    const whereClause = additionalFilters.length > 0 ? and(...additionalFilters) : undefined;

    // Get total count for pagination
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(contracts)
      .where(whereClause);
    
    const total = totalResult[0]?.count || 0;

    // Get paginated results
    const offset = PaginationUtil.getOffset(page, limit);
    const results = await this.db
      .select()
      .from(contracts)
      .where(whereClause)
      .orderBy(desc(contracts.createdAt))
      .limit(limit)
      .offset(offset);

    // Calculate pagination metadata
    const pagination = PaginationUtil.calculatePagination(page, limit, total);

    return {
      data: results,
      pagination,
    };
  }

  async findOne(id: string, userId: string, userRole: UserRole) {
    const contract = await this.db.select().from(contracts).where(and(eq(contracts.id, id), eq(contracts.deleted, false))).limit(1);
    
    if (!contract.length) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    const contractData = contract[0];
    
    // Role-based access control
    if (userRole === UserRole.OWNER && contractData.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    
    return contractData;
  }

  async update(id: string, updateContractDto: UpdateContractDto, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can update contracts');
    }

    const [contract] = await this.db.update(contracts)
      .set({
        ...updateContractDto,
        updatedAt: new Date(),
      })
      .where(and(eq(contracts.id, id), eq(contracts.deleted, false), eq(contracts.ownerId, userId)))
      .returning();

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async remove(id: string, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can delete contracts');
    }

    const [contract] = await this.db.update(contracts)
      .set({ deleted: true, updatedAt: new Date() })
      .where(and(eq(contracts.id, id), eq(contracts.deleted, false), eq(contracts.ownerId, userId)))
      .returning();

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return { message: 'Contract deleted successfully' };
  }

  // Contract Request operations - this is now the main workflow
  async createContractRequest(createContractRequestDto: CreateContractRequestDto, supplierId: string, userRole: UserRole) {
    if (userRole !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can create contract requests');
    }

    const [contractRequest] = await this.db.insert(contractRequests)
      .values({
        ...createContractRequestDto,
        supplierId,
        updatedAt: new Date(),
      })
      .returning();
    return contractRequest;
  }

  async findAllContractRequests(userId: string, userRole: UserRole): Promise<any[]> {
    let whereClause;

    if (userRole === UserRole.SUPPLIER) {
      // Suppliers can see all contract requests (to view available opportunities) and their own requests
      whereClause = and(eq(contractRequests.deleted, false));
    } else if (userRole === UserRole.OWNER) {
      // Owners can see their own contract requests
      whereClause = and(eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId));
    } else {
      throw new ForbiddenException('Access denied');
    }

    return await this.db
      .select()
      .from(contractRequests)
      .where(whereClause)
      .orderBy(desc(contractRequests.createdAt));
  }

  async findMyContractRequests(userId: string, userRole: UserRole): Promise<any[]> {
    let whereClause;

    if (userRole === UserRole.SUPPLIER) {
      // Suppliers can see their own requests
      whereClause = and(eq(contractRequests.deleted, false), eq(contractRequests.supplierId, userId));
    } else if (userRole === UserRole.OWNER) {
      // Owners can see requests made to them
      whereClause = and(eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId));
    } else {
      throw new ForbiddenException('Access denied');
    }

    return await this.db
      .select()
      .from(contractRequests)
      .where(whereClause)
      .orderBy(desc(contractRequests.createdAt));
  }

  async updateContractRequest(id: string, updateContractRequestDto: UpdateContractRequestDto, userId: string, userRole: UserRole) {
    let whereClause;

    if (userRole === UserRole.OWNER) {
      // Owners can update their own contract requests
      whereClause = and(eq(contractRequests.id, id), eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId));
    } else if (userRole === UserRole.SUPPLIER) {
      // Suppliers can update their own requests (status, comment)
      whereClause = and(eq(contractRequests.id, id), eq(contractRequests.deleted, false), eq(contractRequests.supplierId, userId));
    } else {
      throw new ForbiddenException('Access denied');
    }

    const [contractRequest] = await this.db.update(contractRequests)
      .set({
        ...updateContractRequestDto,
        updatedAt: new Date(),
      })
      .where(whereClause)
      .returning();

    if (!contractRequest) {
      throw new NotFoundException(`Contract request with ID ${id} not found`);
    }

    return contractRequest;
  }

  async approveContractRequest(id: string, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can approve contract requests');
    }

    const [contractRequest] = await this.db.update(contractRequests)
      .set({ 
        ownerApproved: true, 
        ownerApprovedAt: new Date(),
        status: 'ongoing', // Move to ongoing when approved
        updatedAt: new Date() 
      })
      .where(and(eq(contractRequests.id, id), eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId)))
      .returning();

    if (!contractRequest) {
      throw new NotFoundException(`Contract request with ID ${id} not found`);
    }

    return contractRequest;
  }

  async markContractRequestAsPaid(id: string, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can mark contract requests as paid');
    }

    const [contractRequest] = await this.db.update(contractRequests)
      .set({ 
        isPaid: true, 
        status: 'completed', // Move to completed when paid
        updatedAt: new Date() 
      })
      .where(and(eq(contractRequests.id, id), eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId)))
      .returning();

    if (!contractRequest) {
      throw new NotFoundException(`Contract request with ID ${id} not found`);
    }

    return contractRequest;
  }
}