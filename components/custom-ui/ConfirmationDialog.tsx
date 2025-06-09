import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const ConfirmationDialog = ({
    open,
    onOpenChange,
    clickFunc,
    subject,
    object,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clickFunc: () => void;
    subject: string;
    object: string;
}) => {
    // Add state to track if the button has been clicked
    const [isProcessing, setIsProcessing] = useState(false);
    // Use a ref to track if action has been triggered - persists between renders
    const actionTriggered = useRef(false);
    // Reset protection mechanisms when dialog opens/closes
    useEffect(() => {
        if (open) {
            // Reset protection when dialog opens
            actionTriggered.current = false;
            setIsProcessing(false);
        }
    }, [open]);
    // Wrapper for the click function with multiple layers of protection
    const handleClick = () => {
        // Multiple protective checks
        if (isProcessing || actionTriggered.current) {
            return; // Prevent multiple clicks
        }
        // Immediately mark as triggered with ref (survives re-renders)
        actionTriggered.current = true;
        // Set processing state for UI feedback
        setIsProcessing(true);

        // Execute action on next tick to ensure UI updates first
        setTimeout(() => {
            try {
                // Close dialog immediately to prevent further interactions
                onOpenChange(false);

                // Execute the action after dialog starts closing
                setTimeout(() => {
                    clickFunc();
                }, 100);
            } catch (error) {
                console.error("Error in confirmation action:", error);
                // Reset in case of errors so the dialog can be used again
                actionTriggered.current = false;
                setIsProcessing(false);
            }
        }, 0);
    };

    // Prevent dialog from closing via escape key or clicking outside when processing
    const handleOpenChange = (newOpenState: boolean) => {
        if (isProcessing && newOpenState === false) {
            // Prevent closing while processing
            return;
        }
        onOpenChange(newOpenState);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={isProcessing ? "pointer-events-none opacity-80" : ""}
            >
                <DialogHeader className="text-center">
                    <DialogTitle className="text-center">
                        {subject} {object}
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        Are you sure you want to {subject} this {object}?
                        {/* {subject.toLowerCase() === "delete" &&
                            " This action cannot be undone."} */}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-3 mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isProcessing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleClick}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : subject}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;
