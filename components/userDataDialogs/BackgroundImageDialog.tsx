import React, { useState, useRef, ChangeEvent, useCallback } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Camera, Pencil, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import Cropper, { Area, Point } from 'react-easy-crop';

// Helper function to create an image element from a URL
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error:any) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous'); // Important for canvas operations
        image.src = url;
    });

// Helper function to get the cropped image Blob
// Note: For a cleaner structure, you might want to move this (and createImage) to a utils file
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    fileName: string = 'cropped-background.jpeg'
): Promise<File | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.error('Failed to get 2d context');
        return null;
    }

    // Set canvas size to the cropped area size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // Convert canvas to blob and then to File
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        }, 'image/jpeg');
    });
}


const BackgroundImageDialog = () => {
    const { user } = useUser();
    const [imageSrc, setImageSrc] = useState<string | null>(null); // For react-easy-crop data URL
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetCropStates = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setCroppedAreaPixels(null); // Reset crop area when new image is loaded
                setZoom(1); // Reset zoom
                setCrop({ x: 0, y: 0 }); // Reset crop position
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixelsVal: Area) => {
        setCroppedAreaPixels(croppedAreaPixelsVal);
    }, []);

    const handleUploadCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            toast.error("Please select an image and crop it.");
            return;
        }

        setIsLoading(true);
        try {
            const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageFile) {
                toast.error("Could not process the image. Please try again.");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('profileBackgroundImage', croppedImageFile);

            const response = await fetch('/api', { // Ensure this API endpoint is correct
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Background image updated successfully!');
                setIsOpen(false); // This will trigger onOpenChange, which calls resetCropStates
                window.location.reload(); // Consider updating state via Redux/context instead
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

    const initialDisplayImageSrc = typeof user?.profileBackgroundImage === 'string' ? user.profileBackgroundImage : '/placeholder-background.jpg';

    return (
        <Dialog 
            open={isOpen} 
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    resetCropStates();
                }
            }}
        >
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 rounded-full p-3 shadow-sm cursor-pointer transition-transform duration-100 hover:scale-105 z-10">
                    <Camera size={20} className="sm:w-6 sm:h-6" color='white'/>
                </div>
            </DialogTrigger>
            <DialogContent showDialogClose={false} className='bg-[#1e1e1e] text-white border-none w-full lg:min-w-4xl  mx-auto'>
                <DialogTitle className='text-center text-lg font-semibold mb-4'>Cover Photo</DialogTitle>
                <div className="flex flex-col items-center space-y-4 w-full">
                    <div className="w-full relative rounded-lg overflow-hidden flex items-center bg-[#1e1e1e] aspect-[4/2]">
                        {imageSrc ? (
                            <div className='w-full relative aspect-[4/2]'>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    classes={{ containerClassName: 'rounded-lg' }}
                                />
                            </div>
                        ) : (
                            <div className='w-full relative aspect-[4/1] '>
                                <Image
                                    src={initialDisplayImageSrc}
                                    alt="Background Preview"
                                    fill
                                    className=" rounded-lg object-cover"
                                    priority={!imageSrc} // Only prioritize if it's the initial image
                                />
                            </div>
                        )}
                    </div>
                    <input
                        aria-label='file'
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className='flex items-center justify-between w-full px-1 sm:px-4 mt-4'>
                        <button 
                            onClick={handleEditClick} 
                            className="flex flex-col items-center px-3 py-2 rounded-lg cursor-pointer gap-1 bg-transparent hover:bg-gray-700 border-none text-white text-sm sm:text-base"
                        >
                            <Pencil size={20} color='white' />
                            {imageSrc ? 'Change' : 'Edit'}
                        </button>
                        <Button 
                            onClick={handleUploadCroppedImage} 
                            disabled={isLoading || !imageSrc || !croppedAreaPixels}
                            className="bg-accent hover:bg-accent/90 disabled:bg-gray-500 text-sm sm:text-base px-3 py-2 sm:px-4"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Update
                        </Button>
                    </div>
                </div>
                <DialogClose className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700">
                    {/* The onOpenChange of Dialog handles reset, so X just closes */}
                    <X size={20} color='white'/>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

export default BackgroundImageDialog;