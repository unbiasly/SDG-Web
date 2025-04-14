import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

const DeletePostModal = ({ open, onOpenChange, postId }: { open: boolean, onOpenChange: (open: boolean) => void, postId: string }) => {

    const handleDelete = async () => {
        const response = await fetch('/api/post', {
            method: 'DELETE',
            body: JSON.stringify({ postId })
        })
        if (response.ok) {
            const data = await response.json()
            console.log("Post deleted successfully", data)
            window.location.reload()
        } else {
            console.error("Failed to delete post")
        }
    }

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">Delete Post</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Are you sure you want to delete this post? This action cannot be undone.
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