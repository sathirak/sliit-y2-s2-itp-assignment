export interface Contract {
  id: string;
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  ownerId: string;
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
  status: 'pending' | 'ongoing' | 'completed' | 'rejected';
  comment?: string;
  isPaid: boolean;
  ownerId: string;
  supplierId: string;
  ownerApproved: boolean;
  ownerApprovedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateContractDto {
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  userId: string;
  userRole: string;
}

export interface UpdateContractDto extends Partial<CreateContractDto> {}

export interface CreateContractRequestDto {
  title: string;
  description: string;
  amount: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  comment?: string;
}

export interface UpdateContractRequestDto {
  status?: 'pending' | 'ongoing' | 'completed' | 'rejected';
  comment?: string;
  isPaid?: boolean;
}

export interface ContractFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  title?: string;
  ownerId?: string;
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
