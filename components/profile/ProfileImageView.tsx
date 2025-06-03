import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog';
import Image from 'next/image';
import { X } from 'lucide-react';


interface ProfileImageViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | File;
}
const ProfileImageView = ({ open, onOpenChange, imageUrl }: ProfileImageViewProps ) => {
  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showDialogClose={false} className='bg-[#1e1e1e] text-white border-none w-full aspect-square '>
                <DialogTitle className='text-center hidden text-lg font-semibold' >Profile Photo</DialogTitle>
                <Image
                    src={typeof imageUrl === 'string' ? imageUrl : ''}
                    alt="Profile"
                    fill
                    sizes="256px"
                    className="object-cover "
                    priority
                />
                <DialogClose className="absolute top-3 right-3 p-1 rounded-full bg-black/40 cursor-pointer">
                    <X size={20} color='white'/>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default ProfileImageView