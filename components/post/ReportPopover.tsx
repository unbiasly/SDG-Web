import { X, AlertTriangle, FileText, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FEEDBACK_OPTIONS, POLICY_OPTIONS } from "@/lib/constants/index-constants";
import { report } from "process";

interface ReportPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  type?: 'post' | 'video' | 'news'; // New parameter for content type
  onReportSubmitted?: () => void; // Add callback for successful report
}

type ReportStep = "choice" | "report" | "feedback";

const ReportPopover = ({ 
  open, 
  onOpenChange, 
  id, 
  type = 'post', // Default to 'post' for backward compatibility
  onReportSubmitted 
}: ReportPopoverProps) => {
  const [step, setStep] = useState<ReportStep>("choice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

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
      const response = await fetch(`/api/${type}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedFeedback,
          report_category: "Feedback",
          id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
      }

      toast.success("Feedback submitted successfully");
      
      // Call the callback if provided
      if (onReportSubmitted) {
        onReportSubmitted();
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
      const response = await fetch(`/api/${type}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedPolicies.join(', '),
          report_category: "Report",
          id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit report');
      }

      toast.success("Report submitted successfully");
      
      // Call the callback if provided
      if (onReportSubmitted) {
        onReportSubmitted();
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePolicy = (policy: string) => {
    if (selectedPolicies.includes(policy)) {
      setSelectedPolicies(selectedPolicies.filter(p => p !== policy));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Report this {type}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Choice Step */}
        {step === "choice" && (
          <div className="py-6">
            <h3 className="text-xl font-semibold mb-6">Select an action</h3>
            
            <div className="space-y-4">
              {/* Feedback Option */}
              <button 
                onClick={handleSelectFeedback}
                className="w-full flex items-center justify-between py-4 px-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2">
                    <AlertTriangle size={36} className="text-gray-800" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold">Provide feedback to change your feed</h4>
                    <p className="text-gray-500 text-xs mt-1">If you think this is inappropriate, you can give us feedback instead of reporting.</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </button>
              
              {/* Report Option */}
              <button 
                onClick={handleSelectReport}
                className="w-full flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2">
                    <FileText size={36} className="text-gray-800" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-semibold">Report content for review</h4>
                    <p className="text-gray-500 text-xs mt-1">Tell us how this goes against our policies or request help for someone.</p>
                  </div>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Report Step */}
        {step === "report" && (
          <div className="">
            <button 
              onClick={handleBackToChoice}
              className="flex items-center gap-1 text-accent mb-6 hover:underline"
            >
              <ChevronRight className="rotate-180 h-4 w-4" />
              <span>Back</span>
            </button>
            
            <h3 className="text-xl font-semibold mb-6">Select our policy that applies</h3>
            
            <div className="flex flex-wrap gap-3 ">
              {POLICY_OPTIONS.map((policy) => (
                <button
                  key={policy}
                  className={`px-3 py-1 cursor-pointer rounded-full border ${
                    selectedPolicies.includes(policy)
                      ? "border-accent bg-blue-50 text-accent"
                      : "border-accent text-accent hover:bg-gray-50"
                  } transition-colors text-sm md:text-base`}
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
                  selectedPolicies.length > 0 && !isSubmitting ? "bg-accent " : "bg-gray-400 cursor-not-allowed"
                } transition-colors`}
                disabled={selectedPolicies.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
        
        {/* Feedback Step */}
        {step === "feedback" && (
          <div className="">
            <button 
              onClick={handleBackToChoice}
              className="flex items-center gap-1 text-accent mb-6 hover:underline"
            >
              <ChevronRight className="rotate-180 h-4 w-4" />
              <span>Back</span>
            </button>
            
            <h3 className="text-xl font-semibold mb-8">Tell us why to help improve the feed.</h3>
            
            <div className="space-y-5 mb-12">
              {FEEDBACK_OPTIONS.map((option) => (
                <div 
                  key={option} 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setSelectedFeedback(option)}
                >
                  <div 
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedFeedback === option ? "border-accent" : "border-gray-300"
                    }`}
                  >
                    {selectedFeedback === option && (
                      <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-800 font-semibold">{option}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <button 
                onClick={handleFeedbackSubmit}
                className={`px-8 py-2 rounded-full font-medium text-white ${
                  selectedFeedback && !isSubmitting ? "bg-accent cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                } transition-colors`}
                disabled={!selectedFeedback || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportPopover;