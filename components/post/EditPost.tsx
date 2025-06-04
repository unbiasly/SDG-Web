"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
    Calendar,
    Image as ImageIcon,
    Video,
    SmilePlus,
    X,
    Globe,
    ChevronDown,
    MessageCircle,
    FileIcon,
} from "lucide-react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/lib/redux/features/user/hooks";
import { toast } from "react-hot-toast";
import { AppApi } from "@/service/app.api";

interface EditPostProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    postId: string;
    initialContent?: string;
    images?: string[];
    onPostUpdate?: () => void;
}

const EditPost = ({
    open,
    onOpenChange,
    postId,
    initialContent = "",
    images = [],
    onPostUpdate,
}: EditPostProps) => {
    // State variables
    const { user } = useUser();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [content, setContent] = useState(initialContent);
    const [existingImages, setExistingImages] = useState<string[]>(images);
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [visibility, setVisibility] = useState("Public");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Update content and images when props change
    useEffect(() => {
        if (initialContent) {
            setContent(initialContent);
        }
        if (images.length > 0) {
            setExistingImages(images);
            setOriginalImages(images);
        }
    }, [initialContent, images]);

    // Fetch post data when the modal opens and no initialContent is provided
    useEffect(() => {
        if (open && postId && !initialContent) {
        } else if (!open) {
            // Reset form when modal closes
            setContent(initialContent || "");
            setPreviewUrls([]);
            setSelectedFiles([]);
            setExistingImages(images || []);
        }
    }, [open, postId, initialContent, images]);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);

            // Create preview URLs for the selected files
            const newPreviewUrls = newFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
        }
    };

    const removeFile = (index: number) => {
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);

        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (content.trim()) {
            setIsLoading(true);

            try {
                // Get the deleted image URLs by comparing original with current
                const deletedImageUrls = originalImages.filter(
                    (url) => !existingImages.includes(url)
                );

                // Create FormData to handle both file uploads and text data
                const postData = new FormData();

                // Add content and postId
                postData.append("content", content);
                postData.append("postId", postId);

                // Add new image files
                selectedFiles.forEach((file) => {
                    postData.append("images", file);
                });

                // Add deleteImageUrls as a JSON string array
                postData.append(
                    "deleteImageUrls",
                    JSON.stringify(deletedImageUrls)
                );

                const response = await AppApi.updatePost(postData);

                if (!response.success) {
                    throw new Error(
                        `Failed to update post: ${response.error}`
                    );
                }

                // Show success message
                toast.success("Post updated successfully");

                // Call onPostUpdate before closing the modal to ensure it runs
                if (typeof onPostUpdate === "function") {
                    // Add a small delay to ensure UI updates properly
                    setTimeout(() => {
                        onPostUpdate();
                    }, 100);
                }

                // Close modal and reset form - do this last
                onOpenChange(false);
            } catch (error) {
                console.error("Error in handlePost:", error);
                toast.error("Failed to update post. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-white">
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full" showDialogClose={false}>
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">
                            Edit post
                        </DialogTitle>
                        <DialogClose
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded-full"
                            aria-label="close"
                        >
                            <X color="black" />
                        </DialogClose>
                    </DialogHeader>

                    {isFetching ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-t-gray-500 border-gray-200 rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <ProfileAvatar
                                        src={user?.profileImage || ""}
                                        alt={`@${user?.username}`}
                                        size="sm"
                                    />

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xl">
                                            {user?.name || `@${user?.username}`}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        ref={textareaRef}
                                        value={content}
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                            // Auto-adjust height based on content
                                            if (textareaRef.current) {
                                                textareaRef.current.style.height =
                                                    "auto";
                                                textareaRef.current.style.height = `${Math.max(
                                                    180,
                                                    textareaRef.current
                                                        .scrollHeight
                                                )}px`;
                                            }
                                        }}
                                        placeholder={`What's on your mind, @${user?.username}?`}
                                        className="w-full min-h-[190px] text-lg resize-none hide-scrollbar outline-none border-0 focus:ring-0"
                                        data-gramm="false"
                                    />
                                </div>
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                                        Current Images
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map(
                                            (imageUrl, index) => (
                                                <div
                                                    key={`existing-${index}`}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Post image ${index}`}
                                                        className="h-20 w-20 object-cover rounded"
                                                    />
                                                    <button
                                                        aria-label="remove"
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                        onClick={() =>
                                                            removeExistingImage(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="w-full justify-between items-center flex space-x-1">
                                {/* More Options Div */}
                                <div className="flex items-center justify-between rounded-lg border border-gray-400 px-2 p-1 dark:border-gray-800">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium text-gray-500">
                                            Add to your post
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {[
                                            {
                                                title: "Add Photo",
                                                icon: (
                                                    <ImageIcon className="h-5 w-5" />
                                                ),
                                                onClick: handlePhotoClick,
                                            },
                                        ].map((button, index) => (
                                            <button
                                                key={index}
                                                className="p-2 cursor-pointer rounded-full hover:bg-gray-100"
                                                title={button.title}
                                                onClick={button.onClick}
                                            >
                                                {button.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className={cn(
                                        "px-8 py-3 rounded-full bg-gray-300 font-bold text-black hover:bg-gray-400",
                                        content.trim()
                                            ? "cursor-pointer "
                                            : "cursor-not-allowed",
                                        isLoading &&
                                            "opacity-75 cursor-not-allowed"
                                    )}
                                    onClick={handlePost}
                                    disabled={!content.trim() || isLoading}
                                >
                                    {isLoading ? "Updating..." : "Update"}
                                </button>
                            </div>

                            {/* New Images Preview */}
                            {previewUrls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="h-20 w-20 object-cover rounded"
                                            />
                                            <button
                                                aria-label="remove"
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Hidden file inputs */}
            <input
                aria-label="image-input"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
        </div>
    );
};

export default EditPost;
