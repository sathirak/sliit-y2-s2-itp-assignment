"use client";

import { useState, useEffect } from "react";
import { Ticket, TicketStatus, UpdateTicketDto } from "@/lib/dtos/ticket";
import { useTicketMutations } from "@/lib/hooks/useTickets";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { Textarea } from "@/modules/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/modules/ui/dialog";
import { Loader2 } from "lucide-react";

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: Ticket | null;
  onSaved: () => void;
}

export function TicketDialog({ open, onOpenChange, ticket, onSaved }: TicketDialogProps) {
  const [formData, setFormData] = useState<UpdateTicketDto>({
    status: TicketStatus.OPEN,
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { updateTicket } = useTicketMutations();

  // Update form data when ticket changes
  useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status,
        notes: ticket.notes || "",
      });
    } else {
      setFormData({
        status: TicketStatus.OPEN,
        notes: "",
      });
    }
    setError(null);
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await updateTicket(ticket.id, formData);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "Open";
      case TicketStatus.IN_PROGRESS:
        return "In Progress";
      case TicketStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {ticket ? "Edit Ticket" : "View Ticket"}
          </DialogTitle>
          <DialogDescription>
            Update ticket status and add notes for customer support.
          </DialogDescription>
        </DialogHeader>

        {ticket && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={ticket.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={ticket.email} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={ticket.phone} disabled />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={ticket.message} disabled rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Created</Label>
              <Input value={new Date(ticket.createdAt).toLocaleString()} disabled />
            </div>

            {/* Editable Fields */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, status: value as TicketStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TicketStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add internal notes about this ticket..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, notes: e.target.value }))
                }
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Updating..." : "Update Ticket"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}