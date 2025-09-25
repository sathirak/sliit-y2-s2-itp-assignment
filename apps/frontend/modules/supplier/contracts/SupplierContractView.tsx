"use client";

import { useState, useEffect, useMemo } from "react";
import { Contract, ContractRequest, UserRole, CreateContractRequestDto } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ContractTable } from "@/modules/admin/contract-management/components/ContractTable";
import { ContractRequestTable } from "@/modules/admin/contract-management/components/ContractRequestTable";
import { ContractRequestDialog } from "./components/ContractRequestDialog";
import { Button } from "@/modules/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { FileText, Users, Plus } from "lucide-react";

export function SupplierContractView() {
  const [allContracts, setAllContracts] = useState<Contract[]>([]);
  const [myRequests, setMyRequests] = useState<ContractRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [activeTab, setActiveTab] = useState("all-contracts");

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

  const fetchAllContracts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // For suppliers, get all available contracts (opportunities to bid on)
      const response = await contractService.getContracts({}, currentUser.id, currentUser.role);
      setAllContracts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    if (!currentUser) return;
    
    try {
      const response = await contractService.getMyContractRequests(currentUser.id, currentUser.role);
      setMyRequests(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch my requests");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllContracts();
      fetchMyRequests();
    }
  }, [currentUser]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load your contracts.</p>
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
          <p>Please log in to access contract requests.</p>
        </div>
      </div>
    );
  }

  const handleCreateRequest = (contract: Contract) => {
    setSelectedContract(contract);
    setIsRequestDialogOpen(true);
  };

  const handleRequestDialogClose = () => {
    setIsRequestDialogOpen(false);
    setSelectedContract(null);
  };

  const handleRequestSaved = () => {
    handleRequestDialogClose();
    // Refresh data
    fetchMyRequests();
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Contracts</h1>
            <p className="text-muted-foreground">
              View available contracts and manage your requests
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-contracts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>All Contracts ({allContracts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="my-requests" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Requests ({myRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Contracts</CardTitle>
              <CardDescription>
                Browse and apply for available contract opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {allContracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{contract.title}</h3>
                        <p className="text-sm text-muted-foreground">{contract.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">Rs {contract.amount}</span>
                          <span>{contract.startDate} - {contract.endDate}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleCreateRequest(contract)}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Apply</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
              <CardDescription>
                Track your contract requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractRequestTable
                requests={myRequests}
                showAll={false}
                showActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <ContractRequestDialog
        open={isRequestDialogOpen}
        onOpenChange={handleRequestDialogClose}
        contract={selectedContract}
        onSaved={handleRequestSaved}
        userId={currentUser.id}
        userRole={currentUser.role}
      />
    </div>
  );
}