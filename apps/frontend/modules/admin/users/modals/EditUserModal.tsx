"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { Edit } from "lucide-react";
import { EditUserForm } from "../forms/EditUserForm";
import type { EditUserFormData } from "../schemas/user.schema";
import type { UserDto } from "@/lib/dtos/user";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserDto | null;
  onUpdateUser: (data: EditUserFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditUserModal({
  open,
  onClose,
  user,
  onUpdateUser,
  isSubmitting = false,
}: EditUserModalProps) {
  async function handleSubmit(data: EditUserFormData) {
    await onUpdateUser(data);
    onClose(); // Close modal after successful update
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Edit className="h-6 w-6" />
              Edit User
            </div>
          </DialogTitle>
          <DialogDescription>
            Update the details for this user.
          </DialogDescription>
        </DialogHeader>
        
        <EditUserForm
          user={user}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
