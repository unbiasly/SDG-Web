import { X, AlertTriangle, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    FEEDBACK_OPTIONS,
    POLICY_OPTIONS,
} from "@/lib/constants/index-constants";
import { useQueryClient } from "@tanstack/react-query";
import { AppApi } from "@/service/app.api";

interface ReportPopoverProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    id: string;
    type?: "post" | "video" | "sdgNews"; // New parameter for content type
    onReportSubmitted?: () => void; // Add callback for successful report
}

type ReportStep = "choice" | "report" | "feedback";

const ReportPopover = ({
    open,
    onOpenChange,
    id,
    type = "post", // Default to 'post' for backward compatibility
    onReportSubmitted,
}: ReportPopoverProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [step, setStep] = useState<ReportStep>("choice");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(
        null
    );
    const queryClient = useQueryClient();

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after animation finishes
        setTimeout(() => {
            setStep("choice");
            setSelectedPolicies([]);
            setSelectedFeedback(null);
        }, 300);
    };

    // Handle feedback submission
    const handleFeedbackSubmit = async () => {
        if (!selectedFeedback) {
            toast.error("Please select a feedback option");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await AppApi.report(
                type,
                selectedFeedback,
                "Feedback",
                id
            );

            if (!response.success) {
                const error = await response.data;
                throw new Error(error.message || "Failed to submit feedback");
            }

            toast.success("Feedback submitted successfully");

            // Invalidate queries based on the content type
            switch (type) {
                case "video":
                    queryClient.invalidateQueries({ queryKey: ["sdgVideos"] });
                    break;
                case "post":
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                    break;
                case "sdgNews":
                    queryClient.invalidateQueries({ queryKey: ["sdgNews"] });
                    break;
                default:
                    // Invalidate all content types to be safe
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                    queryClient.invalidateQueries({ queryKey: ["sdgVideos"] });
                    queryClient.invalidateQueries({ queryKey: ["sdgNews"] });
            }

            // Call the callback if provided
            if (onReportSubmitted) {
                onReportSubmitted();
            }

            handleClose();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            toast.error("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle report submission
    const handleReportSubmit = async () => {
        if (selectedPolicies.length === 0) {
            toast.error("Please select at least one policy");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await AppApi.report(
                type,
                selectedPolicies.join(", "),
                "Report",
                id
            );

            console.log("Report response:", response);

            if (!response.success) {
                throw new Error(response.error || "Failed to submit report");
            }

            toast.success("Report submitted successfully");

            // Invalidate queries based on the content type
            switch (type) {
                case "video":
                    queryClient.invalidateQueries({ queryKey: ["sdgVideos"] });
                    break;
                case "post":
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                    break;
                case "sdgNews":
                    queryClient.invalidateQueries({ queryKey: ["sdgNews"] });
                    break;
                default:
                    // Invalidate all content types to be safe
                    queryClient.invalidateQueries({ queryKey: ["posts"] });
                    queryClient.invalidateQueries({ queryKey: ["sdgVideos"] });
                    queryClient.invalidateQueries({ queryKey: ["sdgNews"] });
            }

            // Call the callback if provided
            if (onReportSubmitted) {
                onReportSubmitted();
            }

            handleClose();
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePolicy = (policy: string) => {
        if (selectedPolicies.includes(policy)) {
            setSelectedPolicies(selectedPolicies.filter((p) => p !== policy));
        } else {
            setSelectedPolicies([...selectedPolicies, policy]);
        }
    };

    const handleBackToChoice = () => {
        setStep("choice");
    };

    const handleSelectFeedback = () => {
        setStep("feedback");
    };

    const handleSelectReport = () => {
        setStep("report");
    };

    // Content component shared between Dialog and Drawer
    const ReportContent = () => (
        <>
            {/* Choice Step */}
            {step === "choice" && (
                <div className="lg:py-6">
                    <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">
                        Select an action
                    </h3>

                    <div className="space-y-4">
                        {/* Feedback Option */}
                        <button
                            onClick={handleSelectFeedback}
                            className="w-full flex items-center justify-between lg:py-4 px-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2">
                                    <AlertTriangle
                                        size={36}
                                        className="text-gray-800"
                                    />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-base lg:text-lg font-semibold">
                                        Provide feedback to change your feed
                                    </h4>
                                    <p className="text-gray-500 text-xs mt-1">
                                        If you think this is inappropriate, you
                                        can give us feedback instead of
                                        reporting.
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-gray-400" />
                        </button>

                        {/* Report Option */}
                        <button
                            onClick={handleSelectReport}
                            className="w-full flex items-center justify-between lg:py-4 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2">
                                    <FileText
                                        size={36}
                                        className="text-gray-800"
                                    />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-base lg:text-lg font-semibold">
                                        Report content for review
                                    </h4>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Tell us how this goes against our
                                        policies or request help for someone.
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={24} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            {/* Report Step */}
            {step === "report" && (
                <div className="space-y-4">
                    <button
                        onClick={handleBackToChoice}
                        className="flex items-center gap-1 text-accent  hover:underline"
                    >
                        <ChevronLeft color="gray" />
                        <span>Back</span>
                    </button>

                    <h3 className="text-base lg:text-xl font-semibold ">
                        Select our policy that applies
                    </h3>

                    <div className="flex flex-wrap gap-2 ">
                        {POLICY_OPTIONS.map((policy) => (
                            <button
                                key={policy}
                                className={`px-2 py-1 cursor-pointer rounded-full border ${
                                    selectedPolicies.includes(policy)
                                        ? "border-accent bg-blue-50 text-accent"
                                        : "border-accent text-accent hover:bg-gray-50"
                                } transition-colors text-xs lg:text-base`}
                                onClick={() => togglePolicy(policy)}
                                disabled={isSubmitting}
                            >
                                {policy}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            onClick={handleReportSubmit}
                            className={`px-8 py-2 rounded-full cursor-pointer font-medium text-white ${
                                selectedPolicies.length > 0 && !isSubmitting
                                    ? "bg-accent "
                                    : "bg-gray-400 cursor-not-allowed"
                            } transition-colors`}
                            disabled={
                                selectedPolicies.length === 0 || isSubmitting
                            }
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            )}

            {/* Feedback Step */}
            {step === "feedback" && (
                <div className="space-y-4">
                    <button
                        onClick={handleBackToChoice}
                        className="flex items-center gap-1 text-accent  hover:underline"
                    >
                        <ChevronLeft color="gray" />
                        <span>Back</span>
                    </button>

                    <h3 className="text-base lg:text-xl font-semibold ">
                        Tell us why to help improve the feed.
                    </h3>

                    <div className="space-y-2 lg:space-y-5 lg:mb-12">
                        {FEEDBACK_OPTIONS.map((option) => (
                            <div
                                key={option}
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => setSelectedFeedback(option)}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedFeedback === option
                                            ? "border-accent"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {selectedFeedback === option && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                                    )}
                                </div>
                                <span className="text-sm text-gray-800 font-semibold">
                                    {option}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            onClick={handleFeedbackSubmit}
                            className={`px-8 py-2 rounded-full font-medium text-white ${
                                selectedFeedback && !isSubmitting
                                    ? "bg-accent cursor-pointer"
                                    : "bg-gray-400 cursor-not-allowed"
                            } transition-colors`}
                            disabled={!selectedFeedback || isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );

    // Conditionally render Dialog or Drawer based on screen size
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader className="border-b border-gray-100 lg:pb-4">
                        <DrawerTitle className="text-lg lg:text-2xl font-bold">
                            Report this {type === "sdgNews" ? "News" : type}
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto">
                        <ReportContent />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader className="border-b p-0 border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className=" text-2xl font-bold">
                            Report this {type}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                <ReportContent />
            </DialogContent>
        </Dialog>
    );
};

export default ReportPopover;
