import React, { useState, useRef, ChangeEvent, useCallback } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { useUser } from "@/lib/redux/features/user/hooks";
import { Camera, Pencil, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Cropper, { Area, Point } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error: any) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

async function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area,
    fileName: string = "cropped-profile.jpeg"
): Promise<File | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Failed to get 2d context");
        return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

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

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Canvas is empty");
                reject(new Error("Canvas is empty"));
                return;
            }
            resolve(new File([blob], fileName, { type: "image/jpeg" }));
        }, "image/jpeg");
    });
}

const ProfileImageDialog = () => {
    const { user } = useUser();
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null
    );

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetStates = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
                setCroppedAreaPixels(null);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const onCropComplete = useCallback(
        (_croppedArea: Area, croppedAreaPixelsVal: Area) => {
            setCroppedAreaPixels(croppedAreaPixelsVal);
        },
        []
    );

    const handleUpdate = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            toast.error("Please select an image and crop it.");
            return;
        }

        setIsLoading(true);
        try {
            const croppedImageFile = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                "profile-image.jpeg"
            );
            if (!croppedImageFile) {
                toast.error("Could not process the image. Please try again.");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("profileImage", croppedImageFile);

            const response = await fetch("/api", {
                method: "PUT",
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("Profile image updated successfully!");
                setIsOpen(false); // This will trigger onOpenChange which calls resetStates
                // Consider a more targeted state update (e.g., Redux) instead of full reload
                window.location.reload();
            } else {
                toast.error(
                    result.message || "Failed to update profile image."
                );
            }
        } catch (error) {
            console.error("Error updating profile image:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Determine what image to show: cropper source, or current user image, or a default
    const displayImageSrc =
        (typeof user?.profileImage === "string"
            ? user.profileImage
            : undefined) || "/default-avatar.png"; // Provide a path to a default avatar

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    resetStates(); // Reset states when dialog is closed
                }
            }}
        >
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-2 shadow-sm cursor-pointer transition-transform duration-100 hover:scale-105">
                    <Camera size={22} color="white" />
                </div>
            </DialogTrigger>
            <DialogContent
                showDialogClose={false}
                className="bg-[#1e1e1e] text-white border-none w-full lg:max-w-lg  mx-auto "
            >
                <DialogTitle className="text-center text-lg font-semibold">
                    Profile Photo
                </DialogTitle>
                <div className="flex flex-col items-center space-y-6  justify-center py-4 w-full">
                    <div className="relative w-full aspect-square mx-auto bg-gray-700 rounded-lg overflow-hidden">
                        {imageSrc ? (
                            <div className="w-full h-full relative aspect-square">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1 / 1} // 1:1 aspect ratio
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    cropShape="round" // For a round cropper
                                    showGrid={false}
                                    classes={{
                                        containerClassName: "rounded-lg",
                                    }} // Ensures cropper fits container
                                />
                            </div>
                        ) : (
                            <div className="w-full relative aspect-square">
                                <Image
                                    src={displayImageSrc}
                                    alt="Profile Preview"
                                    fill
                                    className="object-cover rounded-lg" // if cropShape is not round, ensure this matches
                                    priority={!imageSrc} // Only prioritize if it's the initial image
                                />
                            </div>
                        )}
                    </div>

                    <input
                        aria-label="file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div className="flex items-center justify-between w-full px-4 pt-2">
                        <button
                            onClick={handleEditClick}
                            className="flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer gap-1 bg-transparent hover:bg-gray-700 border-none text-white"
                        >
                            <Pencil size={20} color="white" />
                            {imageSrc ? "Change" : "Edit"}
                        </button>
                        <Button
                            onClick={handleUpdate}
                            disabled={
                                isLoading || !imageSrc || !croppedAreaPixels
                            }
                            className="bg-accent hover:bg-accent/90 disabled:bg-gray-500"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Update
                        </Button>
                    </div>
                </div>
                <DialogClose className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700 cursor-pointer">
                    <X size={20} color="white" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileImageDialog;
