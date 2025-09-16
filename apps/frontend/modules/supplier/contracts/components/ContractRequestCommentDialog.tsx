"use client";

import { useState, useEffect } from "react";
import { ContractRequestComment, CreateContractRequestCommentDto, UserRole } from "@/lib/services/dtos/contract";
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
import { Textarea } from "@/modules/ui/textarea";
import { Label } from "@/modules/ui/label";
import { Loader2, MessageSquare } from "lucide-react";

interface ContractRequestCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractRequestId: string | null;
  onSaved: () => void;
  userId: string;
  userRole: UserRole;
}

export function ContractRequestCommentDialog({
  open,
  onOpenChange,
  contractRequestId,
  onSaved,
  userId,
  userRole,
}: ContractRequestCommentDialogProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<ContractRequestComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!contractRequestId) return;
    
    try {
      const response = await contractService.getContractRequestComments(
        contractRequestId,
        userId,
        userRole
      );
      setComments(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
    }
  };

  useEffect(() => {
    if (open && contractRequestId) {
      fetchComments();
    }
  }, [open, contractRequestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractRequestId || !comment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const commentData: CreateContractRequestCommentDto = {
        comment: comment.trim(),
      };
      
      await contractService.createContractRequestComment(
        contractRequestId,
        commentData,
        userId,
        userRole
      );
      
      setComment("");
      await fetchComments(); // Refresh comments
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setComment("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Contract Request Comments</span>
          </DialogTitle>
          <DialogDescription>
            Add comments and view discussion for this contract request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Comments */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            ) : (
              comments.map((commentItem) => (
                <div key={commentItem.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">User {commentItem.userId}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(commentItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{commentItem.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="comment">Add Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                rows={3}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Close
              </Button>
              <Button type="submit" disabled={loading || !comment.trim()}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Comment
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
