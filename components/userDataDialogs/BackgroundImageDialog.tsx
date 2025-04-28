import React, { useState, useRef, ChangeEvent } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Camera, Pencil, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button'; // Assuming you have a Button component
import { toast } from 'sonner'; // For notifications

const BackgroundImageDialog = () => {
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
        formData.append('profileBackgroundImage', selectedFile);

        try {
            const response = await fetch('/api', { // Uses app/api/route.ts
                method: 'PUT',
                body: formData,
                // Headers are not explicitly set for FormData; browser handles 'multipart/form-data'
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Background image updated successfully!');
                setIsOpen(false); // Close dialog
                setSelectedFile(null);
                setPreviewUrl(null);
                window.location.reload(); // Reload the page
            } else {
                toast.error(result.message || 'Failed to update background image.');
            }
        } catch (error) {
            console.error('Error updating background image:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentImageSrc = previewUrl || (typeof user?.profileBackgroundImage === 'string' ? user.profileBackgroundImage : '/placeholder-background.jpg'); // Fallback placeholder

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <div className="absolute top-4 right-4 bg-black/50  rounded-full p-2 shadow-sm cursor-pointer transition-transform duration-100 hover:scale-105">
                    <Camera size={20} color='white'/>
                </div>
            </DialogTrigger>
            <DialogContent showDialogClose={false} className='bg-[#1e1e1e] text-white border-none w-full'>
                <DialogTitle className='text-center text-lg font-semibold'>Cover Photo</DialogTitle>
                <div className="flex flex-col items-center space-y-6 justify-center py-4">
                    <div className="w-full h-[200px] aspect-video rounded-lg overflow-hidden relative bg-gray-700">
                        <Image
                            src={currentImageSrc}
                            alt="Background Preview"
                            layout="fill"
                            objectFit="cover"
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
                    <div className='flex items-center justify-around w-full h-full pt-2'>
                        <Button variant="outline" onClick={handleEditClick} className="flex items-center gap-2 bg-transparent hover:bg-gray-700 border-gray-600">
                            <Pencil size={16} />
                            Edit
                        </Button>
                        <Button 
                            onClick={handleUpdate} 
                            disabled={isLoading || !selectedFile}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update
                        </Button>
                    </div>
                </div>
                <DialogClose onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700">
                    <X size={20} color='white'/>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default BackgroundImageDialog;