import React, { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";
import { JobSummary } from "./JobSummary";
import { CreateJobForm } from "./JobCreateForm";
import { JobListing, ScreeningQuestion } from "@/service/api.interface";




const JobDialog = () => {
    const [currentView, setCurrentView] = useState<"form" | "summary">("form");
    const [jobData, setJobData] = useState<JobListing>({
        title: "",
        companyName: "",
        companyLogo: "",
        location: "",
        jobType: "",
        salaryRange: "",
        experienceLevel: "",
        description: "",
        applyUrl: "",
        postedBy: "",
        expiresAt: "",
        tags: [],
        screeningQuestions: [],
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = (data: JobListing) => {
        setJobData(data);
        setCurrentView("summary");
    };

    const handleEdit = () => {
        setCurrentView("form");
    };

    const handleClose = () => {
        setCurrentView("form");
        
        // Reset job data
        setJobData({
            title: "",
            companyName: "",
            companyLogo: "",
            location: "",
            jobType: "",
            salaryRange: "",
            experienceLevel: "",
            description: "",
            applyUrl: "",
            postedBy: "",
            expiresAt: "",
            tags: [],
            screeningQuestions: [],
        });
        
        // Close dialog
        setIsOpen(false);
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="flex cursor-pointer items-center gap-2 py-2 px-3 rounded-xl text-white bg-accent hover:bg-accent/90 transition-colors">
                <Plus color="white" size={16} />
                Create Job
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hidden-scrollbar p-0">
                <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            {currentView === "form"
                                ? "Create a job"
                                : "Job Preview"}
                        </DialogTitle>
                        <DialogClose asChild>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close dialog"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4">
                    {currentView === "form" ? (
                        <CreateJobForm
                            onSave={handleSave}
                            initialData={jobData}
                        />
                    ) : (
                        <JobSummary
                            jobData={jobData}
                            onEdit={handleEdit}
                            onPost={handleClose}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JobDialog;
