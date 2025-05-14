import React, { useState, useRef, ChangeEvent } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import ProfileAvatar from '../profile/ProfileAvatar';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Camera, Pencil, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button'; // Assuming you have a Button component
import { toast } from 'sonner'; // For notifications
import Image from 'next/image';
import { current } from '@reduxjs/toolkit';

const ProfileImageDialog = () => {
    const { user } = useUser(); // Assuming fetchUser can refresh user data
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdate = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedFile); // Key for profile image

        try {
            const response = await fetch('/api', { // Uses app/api/route.ts
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Profile image updated successfully!');
                setIsOpen(false); // Close dialog
                setSelectedFile(null);
                setPreviewUrl(null);
                window.location.reload(); // Reload the page
            } else {
                toast.error(result.message || 'Failed to update profile image.');
            }
        } catch (error) {
            console.error('Error updating profile image:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const currentImageSrc = previewUrl || user?.profileImage || '';


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <div className="absolute bottom-1 right-1 bg-black/50  rounded-full p-2 shadow-sm cursor-pointer transition-transform duration-100 hover:scale-105">
                    <Camera size={18} color='white' />
                </div>
            </DialogTrigger>
            <DialogContent showDialogClose={false} className='bg-[#1e1e1e] text-white border-none w-full'>
                <DialogTitle className='text-center text-lg font-semibold'>Profile Photo</DialogTitle>
                <div className="flex flex-col items-center space-y-6 justify-center py-4">
                    
                    <div className="relative w-full flex justify-center h-full ">
                        <Image
                            src={currentImageSrc as string}
                            alt="Profile"
                            width={256}
                            height={256}
                            className="object-cover rounded-lg shadow-lg"
                            priority
                        />
                    </div>

                    <input
                        aria-label='file'
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className='flex items-center justify-between w-full h-full pt-2'>
                         <button onClick={handleEditClick} className="flex flex-col items-center px-4 py-2 rounded-lg aspect-square cursor-pointer gap-1  bg-transparent hover:bg-gray-700 border-none">
                            <Pencil size={20} color='white'/>
                            Edit
                        </button>
                        <Button 
                            onClick={handleUpdate} 
                            disabled={isLoading || !selectedFile}
                            className="bg-accent hover:bg-blue-700 disabled:bg-gray-500"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update
                        </Button>
                    </div>
                </div>
                <DialogClose onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700 cursor-pointer">
                    <X size={20} color='white'/>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default ProfileImageDialog;