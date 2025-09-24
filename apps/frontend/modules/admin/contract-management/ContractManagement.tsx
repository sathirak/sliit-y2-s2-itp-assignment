"use client";

import { useState, useEffect } from "react";
import { Contract, ContractRequest, ContractFilterDto, UserRole } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
import { ContractTable } from "./components/ContractTable";
import { ContractFilters } from "./components/ContractFilters";
import { ContractDialog } from "./components/ContractDialog";
import { ContractRequestTable } from "./components/ContractRequestTable";
import { Button } from "@/modules/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { Plus, FileText, Users } from "lucide-react";

export function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractRequests, setContractRequests] = useState<ContractRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContractFilterDto>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState("contracts");

  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    id: "owner-123",
    role: UserRole.OWNER,
    name: "John Owner"
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getContracts(filters, currentUser.id, currentUser.role);
      // setContracts(response.data);
      // setPagination({
      //   total: response.total,
      //   page: response.page,
      //   limit: response.limit,
      //   totalPages: response.totalPages,
      // });

      // Hardcoded data for now - simplified contracts (no status, isPaid, supplierId)
      const mockContracts: Contract[] = [
        {
          id: "1",
          title: "Website Development Contract",
          description: "Development of a corporate website with modern design and responsive layout",
          amount: "5000.00",
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          ownerId: "owner-123",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          title: "Mobile App Development",
          description: "iOS and Android mobile application development",
          amount: "12000.00",
          startDate: "2024-02-01",
          endDate: "2024-06-30",
          ownerId: "owner-123",
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-01"),
        },
        {
          id: "3",
          title: "E-commerce Platform",
          description: "Full-stack e-commerce platform with payment integration",
          amount: "25000.00",
          startDate: "2024-01-15",
          endDate: "2024-12-15",
          ownerId: "owner-123",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-12-15"),
        },
      ];

      setContracts(mockContracts);
      setPagination({
        total: mockContracts.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchContractRequests = async () => {
    try {
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getMyContractRequests(currentUser.id, currentUser.role);
      // setContractRequests(response);

      // Hardcoded data for now - updated with new structure
      const mockContractRequests: ContractRequest[] = [
        {
          id: "req-1",
          title: "Logo Design Project",
          description: "Professional logo design for new startup company",
          amount: "1500.00",
          startDate: "2024-03-01",
          endDate: "2024-03-15",
          status: "pending",
          comment: "I am very interested in this project and have 5+ years of experience in logo design.",
          isPaid: false,
          ownerId: "owner-123",
          supplierId: "supplier-456",
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-02-28"),
          updatedAt: new Date("2024-02-28"),
        },
        {
          id: "req-2",
          title: "Database Migration Service",
          description: "Migrate legacy database to modern cloud solution",
          amount: "8000.00",
          startDate: "2024-04-01",
          endDate: "2024-05-31",
          status: "ongoing",
          comment: "I have extensive experience with database migrations and cloud platforms.",
          isPaid: false,
          ownerId: "owner-123",
          supplierId: "supplier-789",
          ownerApproved: true,
          ownerApprovedAt: new Date("2024-03-16"),
          createdAt: new Date("2024-03-15"),
          updatedAt: new Date("2024-03-16"),
        },
        {
          id: "req-3",
          title: "Social Media Management",
          description: "Complete social media strategy and content creation",
          amount: "3000.00",
          startDate: "2024-04-01",
          endDate: "2024-07-31",
          status: "completed",
          comment: "I can deliver high-quality social media content and strategy.",
          isPaid: true,
          ownerId: "owner-123",
          supplierId: "supplier-101",
          ownerApproved: true,
          ownerApprovedAt: new Date("2024-03-20"),
          createdAt: new Date("2024-03-19"),
          updatedAt: new Date("2024-07-31"),
        },
      ];

      setContractRequests(mockContractRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contract requests");
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [filters]);

  useEffect(() => {
    fetchContractRequests();
  }, []);

  const handleCreateContract = () => {
    setEditingContract(null);
    setIsDialogOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setIsDialogOpen(true);
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        // TODO: Uncomment when backend is fixed
        // await contractService.deleteContract(id, currentUser.id, currentUser.role);
        // await fetchContracts();
        
        // For now, just remove from local state
        setContracts(prev => prev.filter(contract => contract.id !== id));
        alert("Contract deleted (mock action)");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete contract");
      }
    }
  };

  const handleApproveContractRequest = async (id: string) => {
    try {
      // TODO: Uncomment when backend is fixed
      // await contractService.approveContractRequest(id, currentUser.id, currentUser.role);
      // await fetchContractRequests();
      
      // For now, just update local state
      setContractRequests(prev => prev.map(request => 
        request.id === id ? { 
          ...request, 
          ownerApproved: true, 
          ownerApprovedAt: new Date(),
          status: 'ongoing' 
        } : request
      ));
      alert("Contract request approved (mock action)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve contract request");
    }
  };

  const handleMarkContractRequestAsPaid = async (id: string) => {
    try {
      // TODO: Uncomment when backend is fixed
      // await contractService.markContractRequestAsPaid(id, currentUser.id, currentUser.role);
      // await fetchContractRequests();
      
      // For now, just update local state
      setContractRequests(prev => prev.map(request => 
        request.id === id ? { 
          ...request, 
          isPaid: true,
          status: 'completed'
        } : request
      ));
      alert("Contract request marked as paid (mock action)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark contract request as paid");
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'ongoing' | 'completed' | 'rejected') => {
    try {
      // TODO: Uncomment when backend is fixed
      // await contractService.updateContractRequest(id, { status }, currentUser.id, currentUser.role);
      // await fetchContractRequests();
      
      // For now, just update local state
      setContractRequests(prev => prev.map(request => 
        request.id === id ? { 
          ...request, 
          status,
          // Auto-approve if moving to ongoing
          ...(status === 'ongoing' ? { ownerApproved: true, ownerApprovedAt: new Date() } : {})
        } : request
      ));
      alert(`Contract request status updated to ${status} (mock action)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contract request status");
    }
  };

  const handlePaymentChange = async (id: string, isPaid: boolean) => {
    try {
      // TODO: Uncomment when backend is fixed
      // await contractService.updateContractRequest(id, { isPaid }, currentUser.id, currentUser.role);
      // await fetchContractRequests();
      
      // For now, just update local state
      setContractRequests(prev => prev.map(request => 
        request.id === id ? { 
          ...request, 
          isPaid,
          // Auto-complete if marking as paid
          ...(isPaid ? { status: 'completed' as const } : {})
        } : request
      ));
      alert(`Contract request payment updated to ${isPaid ? 'paid' : 'unpaid'} (mock action)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contract request payment");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingContract(null);
  };

  const handleContractSaved = () => {
    handleDialogClose();
    // TODO: Uncomment when backend is fixed
    // fetchContracts();
    
    // For now, just refresh the mock data
    fetchContracts();
  };

  const handleFilterChange = (newFilters: Partial<ContractFilterDto>) => {
    if (Object.keys(newFilters).length === 0) {
      setFilters({
        page: 1,
        limit: 10,
      });
    } else {
      setFilters(prev => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset to first page when filters change
      }));
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Contract Management</h1>
            <p className="text-muted-foreground">
              Manage contracts and approve contract requests
            </p>
          </div>
        </div>
        <Button onClick={handleCreateContract} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Contract</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contracts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Contracts ({contracts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Requests ({contractRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contracts</CardTitle>
              <CardDescription>
                Manage all contracts in your system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContractFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <ContractTable
                contracts={contracts}
                loading={loading}
                onEdit={handleEditContract}
                onDelete={handleDeleteContract}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract Requests</CardTitle>
              <CardDescription>
                View and manage contract requests from suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractRequestTable
                requests={contractRequests}
                onApprove={handleApproveContractRequest}
                onMarkAsPaid={handleMarkContractRequestAsPaid}
                onStatusChange={handleStatusChange}
                onPaymentChange={handlePaymentChange}
                showAll={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ContractDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        contract={editingContract}
        onSaved={handleContractSaved}
        userId={currentUser.id}
        userRole={currentUser.role}
      />
    </div>
  );
}