import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { toast } from 'sonner';

interface DeletePostModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
    onPostUpdate?: () => void; // Add this callback prop
}

const DeletePostModal = ({ open, onOpenChange, postId, onPostUpdate }: DeletePostModalProps) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/post`, {
                method: 'DELETE',
                body: JSON.stringify({ postId }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            
            // Close the modal
            onOpenChange(false);
            
            // Call the callback to update the parent component
            if (onPostUpdate) {
                onPostUpdate();
            }
            
            // Show success message
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error("Failed to delete post");
        }
    };

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">Delete Post</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Are you sure you want to delete this post?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline" >Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePostModal