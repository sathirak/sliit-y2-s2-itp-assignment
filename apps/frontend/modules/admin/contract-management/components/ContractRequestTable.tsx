"use client";

import { useState, useEffect } from "react";
import { ContractRequest } from "@/lib/services/dtos/contract";
import { UserDto } from "@/lib/dtos/user";
import { getAllUsers } from "@/lib/services/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/ui/table";
import { Button } from "@/modules/ui/button";
import { Badge } from "@/modules/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { CheckCircle, XCircle, Calendar, User, MessageSquare, Clock } from "lucide-react";

interface ContractRequestTableProps {
  requests: ContractRequest[];
  onApprove?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
  onStatusChange?: (id: string, status: 'pending' | 'ongoing' | 'completed' | 'rejected') => void;
  onPaymentChange?: (id: string, isPaid: boolean) => void;
  showAll: boolean;
  showActions?: boolean;
}

export function ContractRequestTable({
  requests,
  onApprove,
  onMarkAsPaid,
  onStatusChange,
  onPaymentChange,
  showAll,
  showActions = true,
}: ContractRequestTableProps) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch all users to create a mapping from ID to name
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Create a mapping from user ID to user name
  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId; // Fallback to ID if user not found
  };
  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        variant: "secondary" as const, 
        label: "Pending", 
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200"
      },
      ongoing: { 
        variant: "default" as const, 
        label: "Ongoing", 
        icon: CheckCircle,
        className: "bg-blue-100 text-blue-800 border-blue-200"
      },
      completed: { 
        variant: "outline" as const, 
        label: "Completed", 
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200"
      },
      rejected: { 
        variant: "destructive" as const, 
        label: "Rejected", 
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-200"
      },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1.5 px-2.5 py-1 ${config.className}`}>
        <Icon className="h-3 w-3 flex-shrink-0" />
        <span className="text-xs font-medium">{config.label}</span>
      </Badge>
    );
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1.5 px-2.5 py-1">
        <CheckCircle className="h-3 w-3 flex-shrink-0" />
        <span className="text-xs font-medium">Paid</span>
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1.5 px-2.5 py-1">
        <XCircle className="h-3 w-3 flex-shrink-0" />
        <span className="text-xs font-medium">Unpaid</span>
      </Badge>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No contract requests found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Duration</TableHead>
              {showAll && <TableHead>Supplier</TableHead>}
              <TableHead>Comment</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {request.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(request.amount)}
                </TableCell>
                <TableCell>
                  {onStatusChange ? (
                    <Select
                      value={request.status}
                      onValueChange={(value) => onStatusChange(request.id, value as 'pending' | 'ongoing' | 'completed' | 'rejected')}
                    >
                      <SelectTrigger className="w-[150px] h-8">
                        <SelectValue>
                          {getStatusBadge(request.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ongoing">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Ongoing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-3 w-3" />
                            <span>Rejected</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(request.status)
                  )}
                </TableCell>
                <TableCell>
                  {onPaymentChange ? (
                    <Select
                      value={request.isPaid.toString()}
                      onValueChange={(value) => onPaymentChange(request.id, value === 'true')}
                    >
                      <SelectTrigger className="w-[135px] h-8">
                        <SelectValue>
                          {getPaymentBadge(request.isPaid)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-3 w-3" />
                            <span>Unpaid</span>
                          </div>
                        </SelectItem>
                        <SelectItem 
                          value="true" 
                          disabled={request.status === 'pending' || request.status === 'rejected'}
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>Paid</span>
                            {(request.status === 'pending' || request.status === 'rejected') && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (Not available for {request.status} status)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getPaymentBadge(request.isPaid)
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                  </div>
                </TableCell>
                {showAll && (
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <User className="h-3 w-3" />
                      <span>{usersLoading ? "Loading..." : getUserName(request.supplierId)}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-sm text-muted-foreground max-w-xs">
                  <div className="truncate" title={request.comment}>
                    {request.comment || "No comment"}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {request.status === 'pending' && onApprove && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {request.status === 'completed' && !request.isPaid && onMarkAsPaid && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onMarkAsPaid(request.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

