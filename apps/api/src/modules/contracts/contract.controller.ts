import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { CreateContractRequestDto } from './dtos/create-contract-request.dto';
import { UpdateContractRequestDto } from './dtos/update-contract-request.dto';
import { ContractDto } from './dtos/contract.dto';
import { ContractRequestDto } from './dtos/contract-request.dto';
import { ContractFilterDto } from './dtos/contract-filter.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { UserRole } from '../users/interfaces/roles.enum';
import { CurrentUser } from '../../common/decorates/current-user.decorator';
import { UserDto } from '../users/dtos/user.dto';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  // Contract endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new contract (Owner only)' })
  @ApiResponse({
    status: 201,
    description: 'Contract created successfully',
    type: ContractDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can create contracts' })
  create(@Body() createContractDto: CreateContractDto, @CurrentUser() user: UserDto) {
    return this.contractService.create(createContractDto, user.id, user.roleName);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Contracts retrieved successfully',
    type: PaginatedResponseDto<ContractDto>,
  })
  findAll(@Query() filters: ContractFilterDto, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.findAll(filters, userId, userRole as UserRole);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by ID' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract retrieved successfully',
    type: ContractDto,
  })
  @ApiResponse({ status: 404, description: 'Contract not found' })
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
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto, @CurrentUser() user: UserDto) {
    return this.contractService.update(id, updateContractDto, user.id, user.roleName);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract ID' })
  @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can delete contracts' })
  remove(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.remove(id, userId, userRole as UserRole);
  }

  // Contract Request endpoints - Main workflow
  @Post('requests')
  @ApiOperation({ summary: 'Create a new contract request (Supplier only)' })
  @ApiResponse({
    status: 201,
    description: 'Contract request created successfully',
    type: ContractRequestDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only suppliers can create contract requests' })
  createContractRequest(@Body() createContractRequestDto: CreateContractRequestDto, @CurrentUser() user: UserDto) {
    return this.contractService.createContractRequest(createContractRequestDto, user.id, user.roleName);
  }

  @Get('requests/all')
  @ApiOperation({ summary: 'Get all contract requests (role-based access)' })
  @ApiResponse({
    status: 200,
    description: 'Contract requests retrieved successfully',
    type: [ContractRequestDto],
  })
  findAllContractRequests(@Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.findAllContractRequests(userId, userRole as UserRole);
  }

  @Get('requests/my')
  @ApiOperation({ summary: 'Get my contract requests (role-based access)' })
  @ApiResponse({
    status: 200,
    description: 'My contract requests retrieved successfully',
    type: [ContractRequestDto],
  })
  findMyContractRequests(@Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.findMyContractRequests(userId, userRole as UserRole);
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Update a contract request' })
  @ApiParam({ name: 'id', description: 'Contract request ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract request updated successfully',
    type: ContractRequestDto,
  })
  @ApiResponse({ status: 404, description: 'Contract request not found' })
  updateContractRequest(
    @Param('id') id: string, 
    @Body() updateContractRequestDto: UpdateContractRequestDto, 
    @CurrentUser() user: UserDto
  ) {
    return this.contractService.updateContractRequest(id, updateContractRequestDto, user.id, user.roleName);
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

  @Patch('requests/:id/mark-paid')
  @ApiOperation({ summary: 'Mark contract request as paid (Owner only)' })
  @ApiParam({ name: 'id', description: 'Contract request ID' })
  @ApiResponse({
    status: 200,
    description: 'Contract request marked as paid successfully',
    type: ContractRequestDto,
  })
  @ApiResponse({ status: 404, description: 'Contract request not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only owners can mark as paid' })
  markContractRequestAsPaid(@Param('id') id: string, @Query('userId') userId: string, @Query('userRole') userRole: string) {
    return this.contractService.markContractRequestAsPaid(id, userId, userRole as UserRole);
  }
}