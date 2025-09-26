"use client";

import { useState, useEffect } from "react";
import { Contract, CreateContractDto, UpdateContractDto, UserRole } from "@/lib/services/dtos/contract";

// Form data type without userId and userRole (these will be added by the service)
type ContractFormData = Omit<CreateContractDto, 'userId' | 'userRole'>;
import { contractService } from "@/lib/services/contract.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import { Loader2 } from "lucide-react";

interface ContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract?: Contract | null;
  onSaved: () => void;
  userId: string;
  userRole: UserRole;
}


export function ContractDialog({ 
  open, 
  onOpenChange, 
  contract, 
  onSaved, 
  userId, 
  userRole 
}: ContractDialogProps) {
  const [formData, setFormData] = useState<ContractFormData>({
    title: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const isEditing = !!contract;

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        description: contract.description,
        amount: contract.amount,
        startDate: contract.startDate,
        endDate: contract.endDate,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
      });
    }
    setError(null);
  }, [contract, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDateError(null);

    // Validate dates before submission
    const dateValidationError = validateDates(formData.startDate, formData.endDate);
    if (dateValidationError) {
      setDateError(dateValidationError);
      setLoading(false);
      return;
    }

    try {
      if (isEditing && contract) {
        const updateData: UpdateContractDto = { 
          ...formData
        };
        await contractService.updateContract(contract.id, updateData, userId, userRole);
      } else {
        const createData: CreateContractDto = { ...formData, userId, userRole };
        await contractService.createContract(createData, userId, userRole);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contract");
    } finally {
      setLoading(false);
    }
  };

  const validateDates = (startDate: string, endDate: string): string | null => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (startDate === endDate) {
      return "Start date and end date cannot be the same";
    }
    
    if (end <= start) {
      return "End date must be after start date";
    }
    
    return null;
  };

  const handleInputChange = (field: keyof ContractFormData, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Validate dates when either date changes
      if (field === 'startDate' || field === 'endDate') {
        const dateValidationError = validateDates(newData.startDate, newData.endDate);
        setDateError(dateValidationError);
      }
      
      return newData;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Contract" : "Create New Contract"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the contract information below."
              : "Fill in the details to create a new contract."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {dateError && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
              {dateError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contract Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter contract title"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                required
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]} // Must be after start date
                required
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter contract description"
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !!dateError}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Contract" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
