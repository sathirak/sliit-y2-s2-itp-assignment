"use client";

import { useState, useEffect } from "react";
import { Contract, CreateContractRequestDto, UserRole } from "@/lib/services/dtos/contract";
import { contractService } from "@/lib/services/contract.service";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";

interface ContractRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  onSaved: () => void;
  userId: string;
  userRole: UserRole;
}

export function ContractRequestDialog({
  open,
  onOpenChange,
  contract,
  onSaved,
  userId,
  userRole,
}: ContractRequestDialogProps) {
  const [formData, setFormData] = useState<CreateContractRequestDto>({
    title: "",
    description: "",
    amount: "",
    startDate: "",
    endDate: "",
    ownerId: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when contract changes
  useEffect(() => {
    if (contract && open) {
      setFormData({
        title: contract.title,
        description: contract.description,
        amount: contract.amount,
        startDate: contract.startDate,
        endDate: contract.endDate,
        ownerId: contract.ownerId,
        comment: "",
      });
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        title: "",
        description: "",
        amount: "",
        startDate: "",
        endDate: "",
        ownerId: "",
        comment: "",
      });
    }
  }, [contract, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      await contractService.createContractRequest(formData, userId, userRole);
      onSaved();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create contract request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      startDate: "",
      endDate: "",
      ownerId: "",
      comment: "",
    });
    setError(null);
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof CreateContractRequestDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for Contract</DialogTitle>
          <DialogDescription>
            Submit your request for this contract opportunity. Include a comment explaining why you're the right fit for this project.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Proposed Amount (Rs)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="Enter your proposed amount"
                required
              />
              <p className="text-xs text-muted-foreground">
                You can modify the amount to propose your own pricing for this contract
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Explain why you're the right fit for this project..."
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
