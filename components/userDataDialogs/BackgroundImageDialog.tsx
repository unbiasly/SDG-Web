import React, { useState, useRef, ChangeEvent } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Camera, Pencil, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const BackgroundImageDialog = () => {
    const { user } = useUser();
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
            const response = await fetch('/api', {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Background image updated successfully!');
                setIsOpen(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                window.location.reload();
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

    const currentImageSrc = previewUrl || (typeof user?.profileBackgroundImage === 'string' ? user.profileBackgroundImage : '/placeholder-background.jpg');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 rounded-full p-3 shadow-sm cursor-pointer transition-transform duration-100 hover:scale-105 z-10">
                    <Camera size={20} className="sm:w-6 sm:h-6" color='white'/>
                </div>
            </DialogTrigger>
            <DialogContent showDialogClose={false} className='bg-[#1e1e1e] text-white border-none w-full max-w-md mx-auto'>
                <DialogTitle className='text-center text-lg font-semibold mb-4'>Cover Photo</DialogTitle>
                <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="w-full relative rounded-lg overflow-hidden bg-gray-700 aspect-[4/1]" >
                        <Image
                            src={currentImageSrc}
                            alt="Background Preview"
                            fill
                            sizes="100vw"
                            className="object-cover"
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
                    <div className='flex items-center justify-between w-full px-4 mt-4'>
                        <button onClick={handleEditClick} className="flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer gap-1 bg-transparent hover:bg-gray-700 border-none">
                            <Pencil size={20} color='white'/>
                            Edit
                        </button>
                        <Button 
                            onClick={handleUpdate} 
                            disabled={isLoading || !selectedFile}
                            className="bg-accent hover:bg-accent/90 disabled:bg-gray-500"
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