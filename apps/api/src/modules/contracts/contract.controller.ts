import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CreateContractRequestDto } from './dtos/create-contract-request.dto';
import { CreateContractRequestCommentDto } from './dtos/create-contract-request-comment.dto';
import { ContractFilterDto } from './dtos/contract-filter.dto';
import { ContractDto } from './dtos/contract.dto';
import { ContractRequestDto } from './dtos/contract-request.dto';
import { ContractRequestCommentDto } from './dtos/contract-request-comment.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { UserRole } from '../users/interfaces/roles.enum';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  // Contract CRUD endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new contract (Owner only)' })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
    type: ContractDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can create contracts' })
  create(@Body() createContractDto: CreateContractDto, @Body('userId') userId: string, @Body('userRole') userRole: string) {
    return this.contractService.create(createContractDto, userId, userRole as UserRole);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts with pagination, search, and filtering (Role-based access)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (1-100)', example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for title or description' })
  @ApiQuery({ name: 'title', required: false, description: 'Filter by contract title' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by contract status', enum: ['pending', 'active', 'completed', 'cancelled'] })
  @ApiQuery({ name: 'isPaid', required: false, description: 'Filter by payment status' })
  @ApiQuery({ name: 'ownerId', required: false, description: 'Filter by owner ID' })
  @ApiQuery({ name: 'supplierId', required: false, description: 'Filter by supplier ID' })
  @ApiQuery({ name: 'minAmount', required: false, description: 'Minimum amount filter' })
  @ApiQuery({ name: 'maxAmount', required: false, description: 'Maximum amount filter' })
  @ApiQuery({ name: 'startDateFrom', required: false, description: 'Start date from filter' })
  @ApiQuery({ name: 'startDateTo', required: false, description: 'Start date to filter' })
  @ApiQuery({ name: 'endDateFrom', required: false, description: 'End date from filter' })
  @ApiQuery({ name: 'endDateTo', required: false, description: 'End date to filter' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of contracts',
    type: PaginatedResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  findAll(@Query() filters: ContractFilterDto, @Query('userId') userId: string, @Query('userRole') userRole: string): Promise<PaginatedResponseDto<ContractDto>> {
    return this.contractService.findAll(filters, userId, userRole as UserRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by ID (Role-based access)' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract found',
    type: ContractDto,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  findOne(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.findOne(id, userId, userRole as UserRole);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contract (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract updated successfully',
    type: ContractDto,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can update contracts' })
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto, @Body('userId') userId: string, @Body('userRole') userRole: string) {
    return this.contractService.update(id, updateContractDto, userId, userRole as UserRole);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a contract (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({ status: 204, description: 'Contract deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can delete contracts' })
  remove(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.remove(id, userId, userRole as UserRole);
  }

  @Patch(':id/mark-paid')
  @ApiOperation({ summary: 'Mark contract as paid (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract marked as paid successfully',
    type: ContractDto,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can mark contracts as paid' })
  markAsPaid(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.markAsPaid(id, userId, userRole as UserRole);
  }

  // Contract Request endpoints
  @Post('requests')
  @ApiOperation({ summary: 'Create a new contract request (Owner only)' })
  @ApiResponse({
    status: 201,
    description: 'Contract request created successfully',
    type: ContractRequestDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can create contract requests' })
  createContractRequest(@Body() createContractRequestDto: CreateContractRequestDto, @Body('userId') userId: string, @Body('userRole') userRole: string) {
    return this.contractService.createContractRequest(createContractRequestDto, userId, userRole as UserRole);
  }

  @Get('requests/all')
  @ApiOperation({ summary: 'Get all contract requests (Role-based access)' })
  @ApiResponse({
    status: 200,
    description: 'List of contract requests',
    type: [ContractRequestDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  findAllContractRequests(@Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.findAllContractRequests(userId, userRole as UserRole);
  }

  @Patch('requests/:id/approve')
  @ApiOperation({ summary: 'Approve a contract request (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract request ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract request approved successfully',
    type: ContractRequestDto,
  })
  @ApiResponse({ status: 404, description: 'Contract request not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can approve contract requests' })
  approveContractRequest(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.approveContractRequest(id, userId, userRole as UserRole);
  }

  // Contract Request Comment endpoints
  @Post('requests/:id/comments')
  @ApiOperation({ summary: 'Add a comment to a contract request (Supplier only)' })
  @ApiParam({ name: 'id', description: 'Contract request ID' })
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
    type: ContractRequestCommentDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only suppliers can comment on contract requests' })
  @ApiResponse({ status: 404, description: 'Contract request not found' })
  createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateContractRequestCommentDto,
    @Body('userId') userId: string,
    @Body('userRole') userRole: string
  ) {
    return this.contractService.createComment(createCommentDto, userId, userRole as UserRole, id);
  }

  @Get('requests/:id/comments')
  @ApiOperation({ summary: 'Get all comments for a contract request (Role-based access)' })
  @ApiParam({ name: 'id', description: 'Contract request ID' })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    type: [ContractRequestCommentDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Contract request not found' })
  getComments(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.getComments(id, userId, userRole as UserRole);
  }
}
