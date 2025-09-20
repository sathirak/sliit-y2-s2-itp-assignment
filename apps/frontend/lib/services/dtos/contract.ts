export interface Contract {
  id: string;
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  isPaid: boolean;
  ownerId: string;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractRequest {
  id: string;
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  ownerId: string;
  supplierId: string;
  ownerApproved: boolean;
  ownerApprovedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractRequestComment {
  id: string;
  comment: string;
  contractRequestId: string;
  userId: string;
  createdAt: Date;
}

export interface CreateContractDto {
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  supplierId: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  isPaid?: boolean;
}

export interface CreateContractRequestDto {
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  supplierId: string;
}

export interface CreateContractRequestCommentDto {
  comment: string;
}

export interface ContractFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  title?: string;
  status?: 'pending' | 'active' | 'completed' | 'cancelled';
  isPaid?: boolean;
  ownerId?: string;
  supplierId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export enum UserRole {
  CUSTOMER = 'customer',
  OWNER = 'owner',
  SALES_REP = 'sales_rep',
  SUPPLIER = 'supplier'
}
