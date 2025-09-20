"use client";

import { Contract } from "@/lib/services/dtos/contract";
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
import { Edit, Trash2, DollarSign, Calendar, User } from "lucide-react";

interface ContractTableProps {
  contracts: Contract[];
  loading: boolean;
  onEdit: (contract: Contract) => void;
  onDelete: (id: string) => void;
  onMarkAsPaid: (id: string) => void;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function ContractTable({
  contracts,
  loading,
  onEdit,
  onDelete,
  onMarkAsPaid,
  pagination,
  onPageChange,
}: ContractTableProps) {
  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      active: { variant: "default" as const, label: "Active" },
      completed: { variant: "outline" as const, label: "Completed" },
      cancelled: { variant: "destructive" as const, label: "Cancelled" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (isPaid: boolean) => {
    return isPaid ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <DollarSign className="h-3 w-3 mr-1" />
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary">
        <DollarSign className="h-3 w-3 mr-1" />
        Unpaid
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No contracts found</p>
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
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{contract.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {contract.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatPrice(contract.amount)}
                </TableCell>
                <TableCell>{getStatusBadge(contract.status)}</TableCell>
                <TableCell>{getPaymentBadge(contract.isPaid)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <User className="h-3 w-3" />
                    <span>{contract.supplierId}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(contract)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!contract.isPaid && contract.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsPaid(contract.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(contract.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} contracts
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
