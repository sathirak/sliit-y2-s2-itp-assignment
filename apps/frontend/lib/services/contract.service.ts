import { 
  Contract, 
  ContractRequest, 
  CreateContractDto, 
  UpdateContractDto, 
  CreateContractRequestDto, 
  UpdateContractRequestDto,
  ContractFilterDto, 
  PaginatedResponse,
  UserRole 
} from './dtos/contract';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ContractService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Contract CRUD operations
  async getContracts(filters: ContractFilterDto = {}, userId: string, userRole: UserRole): Promise<PaginatedResponse<Contract>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    searchParams.append('userId', userId);
    searchParams.append('userRole', userRole);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/contracts?${queryString}` : `/contracts?userId=${userId}&userRole=${userRole}`;
    
    return this.request<PaginatedResponse<Contract>>(endpoint);
  }

  async getContract(id: string, userId: string, userRole: UserRole): Promise<Contract> {
    return this.request<Contract>(`/contracts/${id}?userId=${userId}&userRole=${userRole}`);
  }

  async createContract(contract: CreateContractDto, userId: string, userRole: UserRole): Promise<Contract> {
    return this.request<Contract>('/contracts', {
      method: 'POST',
      body: JSON.stringify({ ...contract, userId, userRole }),
    });
  }

  async updateContract(id: string, contract: UpdateContractDto, userId: string, userRole: UserRole): Promise<Contract> {
    return this.request<Contract>(`/contracts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...contract, userId, userRole }),
    });
  }

  async deleteContract(id: string, userId: string, userRole: UserRole): Promise<void> {
    return this.request<void>(`/contracts/${id}?userId=${userId}&userRole=${userRole}`, {
      method: 'DELETE',
    });
  }

  // Contract Request operations - Main workflow
  async getAllContractRequests(userId: string, userRole: UserRole): Promise<ContractRequest[]> {
    return this.request<ContractRequest[]>(`/contracts/requests/all?userId=${userId}&userRole=${userRole}`);
  }

  async getMyContractRequests(userId: string, userRole: UserRole): Promise<ContractRequest[]> {
    return this.request<ContractRequest[]>(`/contracts/requests/my?userId=${userId}&userRole=${userRole}`);
  }

  async createContractRequest(request: CreateContractRequestDto, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return this.request<ContractRequest>('/contracts/requests', {
      method: 'POST',
      body: JSON.stringify({ ...request, userId, userRole }),
    });
  }

  async updateContractRequest(id: string, request: UpdateContractRequestDto, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return this.request<ContractRequest>(`/contracts/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...request, userId, userRole }),
    });
  }

  async approveContractRequest(id: string, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return this.request<ContractRequest>(`/contracts/requests/${id}/approve?userId=${userId}&userRole=${userRole}`, {
      method: 'PATCH',
    });
  }

  async markContractRequestAsPaid(id: string, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return this.request<ContractRequest>(`/contracts/requests/${id}/mark-paid?userId=${userId}&userRole=${userRole}`, {
      method: 'PATCH',
    });
  }
}

export const contractService = new ContractService();