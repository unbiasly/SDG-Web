import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

const ConfirmationDialog = ({ open, onOpenChange, clickFunc, subject, object }: { open: boolean, onOpenChange: (open: boolean) => void, clickFunc: () => void, subject: string, object: string }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{subject} {object}</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Are you sure you want to {subject} this {object}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline" >Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={clickFunc}>
            {subject}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog