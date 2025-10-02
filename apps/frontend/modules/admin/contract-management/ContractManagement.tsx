"use client";

import { useState, useEffect, useMemo } from "react";
import { Contract, ContractRequest, ContractFilterDto, UserRole } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ContractTable } from "./components/ContractTable";
import { ContractFilters } from "./components/ContractFilters";
import { ContractDialog } from "./components/ContractDialog";
import { ContractRequestTable } from "./components/ContractRequestTable";
import { Button } from "@/modules/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { Plus, FileText, Users, Download } from "lucide-react";
import { downloadContractReport } from "@/lib/utils/report.utils";

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
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Get current user from auth hook
  const { user, isLoading: authLoading } = useAuth();
  
  // Convert role from UserDto to UserRole enum
  const getUserRole = (roleName: string): UserRole => {
    switch (roleName) {
      case 'owner':
        return UserRole.OWNER;
      case 'supplier':
        return UserRole.SUPPLIER;
      case 'customer':
        return UserRole.CUSTOMER;
      default:
        return UserRole.CUSTOMER;
    }
  };

  const currentUser = useMemo(() => {
    return user ? {
      id: user.id,
      role: getUserRole(user.roleName),
      name: `${user.firstName} ${user.lastName}`
    } : null;
  }, [user]);

  const fetchContracts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await contractService.getContracts(filters, currentUser.id, currentUser.role);
      setContracts(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchContractRequests = async () => {
    if (!currentUser) return;
    
    try {
      const response = await contractService.getMyContractRequests(currentUser.id, currentUser.role);
      setContractRequests(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contract requests");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchContracts();
    }
  }, [filters, currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchContractRequests();
    }
  }, [currentUser]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your contract management.</p>
        </div>
      </div>
    );
  }

  // Don't render if no user is authenticated
  if (!currentUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to access contract management.</p>
        </div>
      </div>
    );
  }

  const handleCreateContract = () => {
    setEditingContract(null);
    setIsDialogOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setIsDialogOpen(true);
  };

  const handleDeleteContract = async (id: string) => {
    if (!currentUser) return;
    
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await contractService.deleteContract(id, currentUser.id, currentUser.role);
        await fetchContracts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete contract");
      }
    }
  };

  const handleApproveContractRequest = async (id: string) => {
    if (!currentUser) return;
    
    try {
      await contractService.approveContractRequest(id, currentUser.id, currentUser.role);
      await fetchContractRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve contract request");
    }
  };

  const handleMarkContractRequestAsPaid = async (id: string) => {
    if (!currentUser) return;
    
    try {
      await contractService.markContractRequestAsPaid(id, currentUser.id, currentUser.role);
      await fetchContractRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark contract request as paid");
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'ongoing' | 'completed') => {
    if (!currentUser) return;
    
    try {
      await contractService.updateContractRequest(id, { status }, currentUser.id, currentUser.role);
      await fetchContractRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contract request status");
    }
  };

  const handlePaymentChange = async (id: string, isPaid: boolean) => {
    if (!currentUser) return;
    
    // Find the contract request to check its status
    const request = contractRequests.find(req => req.id === id);
    if (!request) {
      setError("Contract request not found");
      return;
    }
    
    // Prevent setting payment to paid if status is pending or rejected
    if (isPaid && (request.status === 'pending' || request.status === 'rejected')) {
      setError(`Cannot mark payment as paid for ${request.status} contract requests`);
      return;
    }
    
    try {
      await contractService.updateContractRequest(id, { isPaid }, currentUser.id, currentUser.role);
      await fetchContractRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contract request payment");
    }
  };

  const handleRatingChange = async (id: string, rating: number) => {
    if (!currentUser) return;
    
    try {
      await contractService.updateContractRequestRating(id, rating, currentUser.id, currentUser.role);
      await fetchContractRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update contract request rating");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingContract(null);
  };

  const handleContractSaved = () => {
    handleDialogClose();
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

  const handleDownloadReport = async () => {
    if (!currentUser) return;
    
    setDownloadingReport(true);
    try {
      const allContracts = await contractService.getAllContracts(currentUser.id, currentUser.role);
      downloadContractReport(allContracts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download report");
    } finally {
      setDownloadingReport(false);
    }
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            disabled={downloadingReport}
            className="flex items-center space-x-2"
          >
            {downloadingReport ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>{downloadingReport ? 'Downloading...' : 'Download Report'}</span>
          </Button>
          <Button onClick={handleCreateContract} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Contract</span>
          </Button>
        </div>
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
                onStatusChange={(id: string, status: "pending" | "ongoing" | "completed" | "rejected") => {
                  handleStatusChange(id, status as "pending" | "ongoing" | "completed");
                }}
                onPaymentChange={handlePaymentChange}
                onRatingChange={handleRatingChange}
                showAll={true}
                canRate={currentUser.role === UserRole.OWNER}
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