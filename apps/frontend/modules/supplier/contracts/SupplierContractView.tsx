"use client";

import { useState, useEffect } from "react";
import { Contract, ContractRequest, UserRole, CreateContractRequestDto } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
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

  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    id: "supplier-123",
    role: UserRole.SUPPLIER,
    name: "Jane Supplier"
  };

  const fetchAllContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getContracts({}, currentUser.id, currentUser.role);
      // setAllContracts(response.data);

      // Hardcoded data for now - all available contracts (opportunities for suppliers)
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
          ownerId: "owner-456",
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
          ownerId: "owner-789",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-12-15"),
        },
        {
          id: "4",
          title: "Database Migration Service",
          description: "Migrate legacy database to modern cloud solution",
          amount: "8000.00",
          startDate: "2024-04-01",
          endDate: "2024-05-31",
          ownerId: "owner-101",
          createdAt: new Date("2024-03-15"),
          updatedAt: new Date("2024-03-15"),
        },
      ];

      setAllContracts(mockContracts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getMyContractRequests(currentUser.id, currentUser.role);
      // setMyRequests(response);

      // Hardcoded data for now - supplier's own requests
      const mockMyRequests: ContractRequest[] = [
        {
          id: "req-supplier-1",
          title: "E-commerce Store Development",
          description: "Full-stack e-commerce store with payment integration",
          amount: "15000.00",
          startDate: "2024-03-01",
          endDate: "2024-06-30",
          status: "pending",
          comment: "I have 8+ years of experience in e-commerce development and can deliver a high-quality solution.",
          isPaid: false,
          ownerId: "owner-123",
          supplierId: "supplier-123", // This supplier's request
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-02-28"),
          updatedAt: new Date("2024-02-28"),
        },
        {
          id: "req-supplier-2",
          title: "Social Media Management",
          description: "Complete social media strategy and content creation",
          amount: "3000.00",
          startDate: "2024-04-01",
          endDate: "2024-07-31",
          status: "ongoing",
          comment: "I specialize in social media marketing and have managed campaigns for 50+ brands.",
          isPaid: false,
          ownerId: "owner-456",
          supplierId: "supplier-123", // This supplier's request
          ownerApproved: true,
          ownerApprovedAt: new Date("2024-03-11"),
          createdAt: new Date("2024-03-10"),
          updatedAt: new Date("2024-03-11"),
        },
      ];

      setMyRequests(mockMyRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch my requests");
    }
  };


  useEffect(() => {
    fetchAllContracts();
    fetchMyRequests();
  }, []);

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