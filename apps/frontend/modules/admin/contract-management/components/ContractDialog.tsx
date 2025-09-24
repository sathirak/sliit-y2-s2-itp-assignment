"use client";

import { useState, useEffect } from "react";
import { Contract, CreateContractDto, UpdateContractDto, UserRole } from "@/lib/services/dtos/contract";
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
  const [formData, setFormData] = useState<CreateContractDto>({
    title: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      if (isEditing && contract) {
        const updateData: UpdateContractDto = { 
          ...formData
        };
        await contractService.updateContract(contract.id, updateData, userId, userRole);
      } else {
        await contractService.createContract(formData, userId, userRole);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contract");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateContractDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Contract" : "Create Contract"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
