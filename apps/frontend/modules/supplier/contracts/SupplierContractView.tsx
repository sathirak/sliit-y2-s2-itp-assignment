"use client";

import { useState, useEffect } from "react";
import { Contract, ContractRequest, ContractRequestComment, UserRole } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
import { ContractTable } from "@/modules/admin/contract-management/components/ContractTable";
import { ContractRequestTable } from "@/modules/admin/contract-management/components/ContractRequestTable";
import { ContractRequestCommentDialog } from "./components/ContractRequestCommentDialog";
import { Button } from "@/modules/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/modules/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/ui/tabs";
import { FileText, Users, MessageSquare, Plus } from "lucide-react";

export function SupplierContractView() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractRequests, setContractRequests] = useState<ContractRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("contracts");

  // Mock user data - in real app, this would come from auth context
  const currentUser = {
    id: "supplier-123",
    role: UserRole.SUPPLIER,
    name: "Jane Supplier"
  };

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getContracts({}, currentUser.id, currentUser.role);
      // setContracts(response.data);

      // Hardcoded data for now - contracts where this supplier is involved
      const mockContracts: Contract[] = [
        {
          id: "1",
          title: "Website Development Contract",
          description: "Development of a corporate website with modern design and responsive layout",
          amount: "5000.00",
          startDate: "2024-01-01",
          endDate: "2024-03-31",
          status: "active",
          isPaid: false,
          ownerId: "owner-123",
          supplierId: "supplier-123", // This supplier
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: "4",
          title: "Mobile App UI/UX Design",
          description: "Complete UI/UX design for mobile application",
          amount: "3500.00",
          startDate: "2024-02-15",
          endDate: "2024-04-15",
          status: "pending",
          isPaid: false,
          ownerId: "owner-456",
          supplierId: "supplier-123", // This supplier
          createdAt: new Date("2024-02-15"),
          updatedAt: new Date("2024-02-15"),
        },
        {
          id: "5",
          title: "Brand Identity Package",
          description: "Complete brand identity design including logo, colors, and guidelines",
          amount: "2200.00",
          startDate: "2024-01-10",
          endDate: "2024-02-10",
          status: "completed",
          isPaid: true,
          ownerId: "owner-789",
          supplierId: "supplier-123", // This supplier
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-02-10"),
        },
      ];

      setContracts(mockContracts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contracts");
    } finally {
      setLoading(false);
    }
  };

  const fetchContractRequests = async () => {
    try {
      // TODO: Uncomment when backend is fixed
      // const response = await contractService.getContractRequests(currentUser.id, currentUser.role);
      // setContractRequests(response);

      // Hardcoded data for now - mix of supplier's requests and all available requests
      const mockContractRequests: ContractRequest[] = [
        // Supplier's own requests
        {
          id: "req-supplier-1",
          title: "E-commerce Store Development",
          description: "Full-stack e-commerce store with payment integration",
          amount: "15000.00",
          startDate: "2024-03-01",
          endDate: "2024-06-30",
          status: "pending",
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
          status: "pending",
          ownerId: "owner-456",
          supplierId: "supplier-123", // This supplier's request
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-03-10"),
          updatedAt: new Date("2024-03-10"),
        },
        // Other suppliers' requests (available to view and comment)
        {
          id: "req-other-1",
          title: "Logo Design Project",
          description: "Professional logo design for new startup company",
          amount: "1500.00",
          startDate: "2024-03-01",
          endDate: "2024-03-15",
          status: "pending",
          ownerId: "owner-789",
          supplierId: "supplier-456", // Different supplier
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-02-28"),
          updatedAt: new Date("2024-02-28"),
        },
        {
          id: "req-other-2",
          title: "Database Migration Service",
          description: "Migrate legacy database to modern cloud solution",
          amount: "8000.00",
          startDate: "2024-04-01",
          endDate: "2024-05-31",
          status: "pending",
          ownerId: "owner-101",
          supplierId: "supplier-789", // Different supplier
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-03-15"),
          updatedAt: new Date("2024-03-15"),
        },
        {
          id: "req-other-3",
          title: "Mobile App Backend Development",
          description: "RESTful API development for mobile application",
          amount: "12000.00",
          startDate: "2024-05-01",
          endDate: "2024-08-31",
          status: "pending",
          ownerId: "owner-202",
          supplierId: "supplier-101", // Different supplier
          ownerApproved: false,
          ownerApprovedAt: null,
          createdAt: new Date("2024-04-01"),
          updatedAt: new Date("2024-04-01"),
        },
      ];

      setContractRequests(mockContractRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contract requests");
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchContractRequests();
  }, []);

  const handleCommentRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsCommentDialogOpen(true);
  };

  const handleCommentSaved = () => {
    setIsCommentDialogOpen(false);
    setSelectedRequestId(null);
    // TODO: Uncomment when backend is fixed
    // fetchContractRequests();
    
    // For now, just show success message
    alert("Comment added successfully (mock action)");
  };

  const myRequests = contractRequests.filter(req => req.supplierId === currentUser.id);
  const allRequests = contractRequests;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">My Contracts</h1>
            <p className="text-muted-foreground">
              View your contracts and contract requests
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contracts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>My Contracts ({contracts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="my-requests" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Requests ({myRequests.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all-requests" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>All Requests ({allRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Contracts</CardTitle>
              <CardDescription>
                Contracts where you are the supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <ContractTable
                contracts={contracts}
                loading={loading}
                onEdit={() => {}} // Suppliers can't edit contracts
                onDelete={() => {}} // Suppliers can't delete contracts
                onMarkAsPaid={() => {}} // Suppliers can't mark as paid
                pagination={{
                  total: contracts.length,
                  page: 1,
                  limit: 10,
                  totalPages: 1,
                }}
                onPageChange={() => {}}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Contract Requests</CardTitle>
              <CardDescription>
                Contract requests you have submitted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractRequestTable
                requests={myRequests}
                onApprove={() => {}} // Suppliers can't approve their own requests
                showAll={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contract Requests</CardTitle>
              <CardDescription>
                All available contract requests you can view and comment on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allRequests.map((request) => (
                  <Card key={request.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold">{request.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Amount: ${parseFloat(request.amount).toLocaleString()}</span>
                          <span>Status: {request.status}</span>
                          <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCommentRequest(request.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ContractRequestCommentDialog
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        contractRequestId={selectedRequestId}
        onSaved={handleCommentSaved}
        userId={currentUser.id}
        userRole={currentUser.role}
      />
    </div>
  );
}
