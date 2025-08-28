import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { Schema } from 'src/common/types/db';
import { DatabaseAsyncProvider } from 'src/database/database.provider';
import { contracts } from './models/contract.model';
import { contractRequests } from './models/contract-request.model';
import { contractRequestComments } from './models/contract-request-comment.model';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CreateContractRequestDto } from './dtos/create-contract-request.dto';
import { CreateContractRequestCommentDto } from './dtos/create-contract-request-comment.dto';
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
      status,
      isPaid,
      ownerId,
      supplierId,
      minAmount,
      maxAmount,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    } = filters;

    // Build where clause with role-based filtering
    const additionalFilters: any[] = [eq(contracts.deleted, false)];

    // Role-based access control
    if (userRole === UserRole.SUPPLIER) {
      // Suppliers can only see contracts where they are the supplier
      additionalFilters.push(eq(contracts.supplierId, userId));
    } else if (userRole === UserRole.OWNER) {
      // Owners can only see contracts where they are the owner
      additionalFilters.push(eq(contracts.ownerId, userId));
    }

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
    if (status) {
      additionalFilters.push(eq(contracts.status, status));
    }
    if (isPaid !== undefined) {
      additionalFilters.push(eq(contracts.isPaid, isPaid));
    }
    if (ownerId) {
      additionalFilters.push(eq(contracts.ownerId, ownerId));
    }
    if (supplierId) {
      additionalFilters.push(eq(contracts.supplierId, supplierId));
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
    if (userRole === UserRole.SUPPLIER && contractData.supplierId !== userId) {
      throw new ForbiddenException('Access denied');
    }
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

  async markAsPaid(id: string, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can mark contracts as paid');
    }

    const [contract] = await this.db.update(contracts)
      .set({ 
        isPaid: true, 
        updatedAt: new Date() 
      })
      .where(and(eq(contracts.id, id), eq(contracts.deleted, false), eq(contracts.ownerId, userId)))
      .returning();

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  // Contract Request operations
  async createContractRequest(createContractRequestDto: CreateContractRequestDto, ownerId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can create contract requests');
    }

    const [contractRequest] = await this.db.insert(contractRequests)
      .values({
        ...createContractRequestDto,
        ownerId,
        updatedAt: new Date(),
      })
      .returning();
    return contractRequest;
  }

  async findAllContractRequests(userId: string, userRole: UserRole): Promise<any[]> {
    let whereClause;

    if (userRole === UserRole.SUPPLIER) {
      // Suppliers can see their own contract requests
      whereClause = and(eq(contractRequests.deleted, false), eq(contractRequests.supplierId, userId));
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

  async approveContractRequest(id: string, userId: string, userRole: UserRole) {
    if (userRole !== UserRole.OWNER) {
      throw new ForbiddenException('Only owners can approve contract requests');
    }

    const [contractRequest] = await this.db.update(contractRequests)
      .set({ 
        ownerApproved: true, 
        ownerApprovedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(and(eq(contractRequests.id, id), eq(contractRequests.deleted, false), eq(contractRequests.ownerId, userId)))
      .returning();

    if (!contractRequest) {
      throw new NotFoundException(`Contract request with ID ${id} not found`);
    }

    return contractRequest;
  }

  // Contract Request Comment operations
  async createComment(createCommentDto: CreateContractRequestCommentDto, userId: string, userRole: UserRole, contractRequestId: string) {
    if (userRole !== UserRole.SUPPLIER) {
      throw new ForbiddenException('Only suppliers can comment on contract requests');
    }

    // Verify the contract request exists and belongs to the supplier
    const contractRequest = await this.db
      .select()
      .from(contractRequests)
      .where(and(eq(contractRequests.id, contractRequestId), eq(contractRequests.deleted, false)))
      .limit(1);

    if (!contractRequest.length) {
      throw new NotFoundException('Contract request not found');
    }

    if (contractRequest[0].supplierId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const [comment] = await this.db.insert(contractRequestComments)
      .values({
        comment: createCommentDto.comment,
        contractRequestId,
        userId,
      })
      .returning();
    return comment;
  }

  async getComments(contractRequestId: string, userId: string, userRole: UserRole): Promise<any[]> {
    // Verify the contract request exists and user has access
    const contractRequest = await this.db
      .select()
      .from(contractRequests)
      .where(and(eq(contractRequests.id, contractRequestId), eq(contractRequests.deleted, false)))
      .limit(1);

    if (!contractRequest.length) {
      throw new NotFoundException('Contract request not found');
    }

    const cr = contractRequest[0];
    if (userRole === UserRole.SUPPLIER && cr.supplierId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    if (userRole === UserRole.OWNER && cr.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return await this.db
      .select()
      .from(contractRequestComments)
      .where(eq(contractRequestComments.contractRequestId, contractRequestId))
      .orderBy(desc(contractRequestComments.createdAt));
  }
}
