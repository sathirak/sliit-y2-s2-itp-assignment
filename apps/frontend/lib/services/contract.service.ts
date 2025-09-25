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
import { apiPrivateClient } from '../private';

class ContractService {

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
    const endpoint = queryString ? `contracts?${queryString}` : `contracts?userId=${userId}&userRole=${userRole}`;
    
    return apiPrivateClient.get(endpoint).json<PaginatedResponse<Contract>>();
  }

  async getContract(id: string, userId: string, userRole: UserRole): Promise<Contract> {
    return apiPrivateClient.get(`contracts/${id}?userId=${userId}&userRole=${userRole}`).json<Contract>();
  }

  async createContract(contract: CreateContractDto, userId: string, userRole: UserRole): Promise<Contract> {
    return apiPrivateClient.post('contracts', {
      json: {
        ...contract,
        userId,
        userRole
      }
    }).json<Contract>();
  }

  async updateContract(id: string, contract: UpdateContractDto, userId: string, userRole: UserRole): Promise<Contract> {
    return apiPrivateClient.patch(`contracts/${id}`, {
      json: {
        ...contract,
        userId,
        userRole
      }
    }).json<Contract>();
  }

  async deleteContract(id: string, userId: string, userRole: UserRole): Promise<void> {
    await apiPrivateClient.delete(`contracts/${id}?userId=${userId}&userRole=${userRole}`);
  }

  // Contract Request operations - Main workflow
  async getAllContractRequests(userId: string, userRole: UserRole): Promise<ContractRequest[]> {
    return apiPrivateClient.get(`contracts/requests/all?userId=${userId}&userRole=${userRole}`).json<ContractRequest[]>();
  }

  async getMyContractRequests(userId: string, userRole: UserRole): Promise<ContractRequest[]> {
    return apiPrivateClient.get(`contracts/requests/my?userId=${userId}&userRole=${userRole}`).json<ContractRequest[]>();
  }

  async createContractRequest(request: CreateContractRequestDto, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return apiPrivateClient.post('contracts/requests', {
      json: request
    }).json<ContractRequest>();
  }

  async updateContractRequest(id: string, request: UpdateContractRequestDto, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return apiPrivateClient.patch(`contracts/requests/${id}`, {
      json: request
    }).json<ContractRequest>();
  }

  async approveContractRequest(id: string, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return apiPrivateClient.patch(`contracts/requests/${id}/approve?userId=${userId}&userRole=${userRole}`).json<ContractRequest>();
  }

  async markContractRequestAsPaid(id: string, userId: string, userRole: UserRole): Promise<ContractRequest> {
    return apiPrivateClient.patch(`contracts/requests/${id}/mark-paid?userId=${userId}&userRole=${userRole}`).json<ContractRequest>();
  }
}

export const contractService = new ContractService();