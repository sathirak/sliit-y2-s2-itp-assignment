"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { UserPlus } from "lucide-react";
import { AddUserForm } from "../forms/AddUserForm";
import type { CreateUserFormData } from "../schemas/user.schema";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreateUser: (data: CreateUserFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddUserModal({
  open,
  onClose,
  onCreateUser,
  isSubmitting = false,
}: AddUserModalProps) {
  async function handleSubmit(data: CreateUserFormData) {
    await onCreateUser(data);
    onClose(); // Close modal after successful creation
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Add New User
            </div>
          </DialogTitle>
          <DialogDescription>
            Create a new user with their basic information.
          </DialogDescription>
        </DialogHeader>
        
        <AddUserForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
