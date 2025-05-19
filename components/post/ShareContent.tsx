import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Check, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ShareContentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contentUrl?: string;
    itemId?: string;
}

const ShareContent: React.FC<ShareContentProps> = ({
    open,
    onOpenChange,
    contentUrl,
    itemId
}) => {
    const [copied, setCopied] = useState(false);
    const [fullUrl, setFullUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            
            const domain = window.location.origin; 

            const isFullUrl =
                contentUrl &&
                (contentUrl.startsWith("http://") ||
                    contentUrl.startsWith("https://"));
            const urlToShare = isFullUrl
                ? contentUrl
                : `${domain}${contentUrl || window.location.pathname}`;

            setFullUrl(urlToShare);
        }
    }, [contentUrl, open]);

    const copyToClipboard = async (text: string) => {
        try {
            // handleShare("copy");
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
            console.error("Failed to copy:", err);
        }
    };

    // const handleShare = async (destination: string) => {
    //     if (!itemId) return;
        
    //     try {
    //         const response = await fetch(`/api/post/post-action`, {
    //             method: "PATCH",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 actionType: "share",
    //                 shareDestination: destination, // Use a valid enum value instead of full URL
    //                 postId: itemId,
    //             }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             console.error("Share tracking error:", errorData);
    //             // Don't show errors to user for analytics failures
    //             // The copy still works even if tracking fails
    //         }
    //     } catch (error) {
    //         console.error("Error tracking share action:", error);
    //     }
    // }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showDialogClose={false} className="max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between ">
                    <DialogTitle>Share this post</DialogTitle>
                    <DialogClose>
                        <X />
                    </DialogClose>
                </DialogHeader>

                <div className="flex flex-col gap-6">

                    <div className="mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 overflow-hidden text-xl">
                            <Input
                                value={fullUrl}
                                className="border-0 flex-grow px-3 py-2 focus:ring-0"
                                readOnly
                            />
                            <Button
                                onClick={() => copyToClipboard(fullUrl)}
                                className="px-3 rounded-full bg-gray-300 hover:bg-accent hover:text-white text-black h-full"
                            >
                                {copied ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                                <span className="ml-2 text-md font-bold">
                                    {copied ? "Copied" : "Copy"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareContent;
