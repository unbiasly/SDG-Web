import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog';
import Image from 'next/image';
import { X } from 'lucide-react';


interface BackgroundImageViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | File;
}
const BackgroundImageView = ({ open, onOpenChange, imageUrl }: BackgroundImageViewProps ) => {

    const isDefaultImage = imageUrl === '/Profile-BG.png';

  return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showDialogClose={false} className={`bg-[#1e1e1e] text-white border-none w-full lg:min-w-4xl ${!isDefaultImage ? 'aspect-[4/1]' : 'aspect-[16/9]  '}`}>
            <DialogTitle className='hidden'>Background Photo</DialogTitle>
            <Image
                src={typeof imageUrl === 'string' ? imageUrl : ''}
                alt="Background"
                fill
                sizes="500px"
                className={`${isDefaultImage ? 'object-contain p-2' : 'object-cover'}`}
                priority
            />
            <DialogClose className="absolute top-3 right-3 p-1 rounded-full bg-black/40 cursor-pointer">
                <X size={20} color='white'/>
            </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default BackgroundImageView