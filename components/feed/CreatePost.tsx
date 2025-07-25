"use client";
import React, { useState, useRef } from "react";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/lib/redux/features/user/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AppApi } from "@/service/app.api";

const CreatePost = () => {
    // State variables
    const [open, setOpen] = useState(false);
    const { user, userLoading } = useUser();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [content, setContent] = useState("");
    //   const [visibility, setVisibility] = useState('Public');

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const queryClient = useQueryClient();

    // Create post mutation using TanStack Query
    const createPostMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await AppApi.createPost(formData);

            return response.data;
        },
        onSuccess: () => {
            // Reset form state
            setContent("");
            setSelectedFiles([]);
            setPreviewUrls((prev) => {
                prev.forEach((url) => URL.revokeObjectURL(url));
                return [];
            });

            // Close dialog
            setOpen(false);

            // Invalidate and refetch posts query
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error: Error) => {
            console.error("Error creating post:", error);
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);

        // Auto-adjust height based on content
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.max(
                180,
                textareaRef.current.scrollHeight
            )}px`;
        }
    };

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

    const handlePost = async () => {
        if (!content.trim()) return;

        try {
            const postData = new FormData();
            postData.append("content", content);

            // Add each file to the FormData
            selectedFiles.forEach((file) => {
                postData.append("images", file);
            });

            // Trigger the mutation
            createPostMutation.mutate(postData);
        } catch (error) {
            console.error("Error in handlePost:", error);
        }
    };

    const postContent = (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <ProfileAvatar
                    src={user?.profileImage || ""}
                    userName={user?.name || user?.username}
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
                    onChange={handleInputChange}
                    placeholder={`What's on your mind, ${
                        user?.name || `@${user?.username}`
                    }?`}
                    className="w-full min-h-[190px] text-lg resize-none hide-scrollbar outline-none border-0 focus:ring-0"
                    data-gramm="false"
                />
            </div>

            {/* Preview images */}
            {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const actionButtons = (
        <div className="w-full justify-between items-center flex space-x-1">
            {/* More Options Div */}
            <div className="flex items-center justify-between rounded-lg border border-gray-400 px-2 p-1 dark:border-gray-800">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-500">
                        Add to your post
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 cursor-pointer rounded-full hover:bg-gray-100"
                        title="Add Photo"
                        onClick={handlePhotoClick}
                    >
                        <ImageIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <button
                className={cn(
                    "px-8 py-3 rounded-full bg-gray-300 font-bold text-black hover:bg-gray-400",
                    content.trim() ? "cursor-pointer " : "cursor-not-allowed",
                    createPostMutation.isPending &&
                        "opacity-75 cursor-not-allowed"
                )}
                onClick={handlePost}
                disabled={!content.trim() || createPostMutation.isPending}
            >
                {createPostMutation.isPending ? "Posting..." : "Post"}
            </button>
        </div>
    );

    return (
        <div className="bg-white p-4 border-b border-gray-300 mb-4">
            {/* Responsive Dialog for all screen sizes */}
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="flex w-full items-center gap-2">
                    <ProfileAvatar
                        src={user?.profileImage || ""}
                        userName={user?.name || user?.username}
                        alt="User Avatar"
                        size="xs"
                    />
                    <DialogTrigger className="w-full">
                        <div className="border border-gray-300 rounded-full px-4 py-2 flex justify-start cursor-pointer hover:bg-gray-200">
                            <p className="text-gray-500">
                                Post your Thoughts...
                            </p>
                        </div>
                    </DialogTrigger>
                </div>

                <DialogContent
                    className="w-full max-w-[95vw] md:max-w-[500px] h-auto"
                    showDialogClose={false}
                >
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-xl md:text-2xl font-bold">
                            Create a post
                        </DialogTitle>
                        <DialogClose className='p-2 hover:bg-gray-100 cursor-pointer rounded-full' aria-label='close'>
                            <X color="black"/>
                        </DialogClose>
                    </DialogHeader>

                    {postContent}
                    {actionButtons}
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

export default CreatePost;
