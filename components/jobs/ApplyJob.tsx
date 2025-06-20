import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, Building, Users, IndianRupee, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogClose, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { JobListing, QuestionAnswer } from "@/service/api.interface";
import QuestionScreen from "./QuestionScreen";
import ResumeUploadCard from "./ResumeUpload";
import { AppApi } from "@/service/app.api";
import { useQueryClient } from "@tanstack/react-query";

interface ApplyJobProps {
    jobData: JobListing;
    onEdit?: () => void;
    onPost?: () => void;
}

export const ApplyJob: React.FC<ApplyJobProps> = ({ jobData, onEdit, onPost }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentScreen, setCurrentScreen] = useState<"questions" | "resume">("questions");
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    
    // Application data state
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleNext = () => {
        // Validate questions before proceeding
        if (currentScreen === "questions") {
            // Add safety check for screeningQuestions
            const screeningQuestions = jobData.screeningQuestions || [];
            const unansweredQuestions = screeningQuestions.filter(
                (question) => question._id && !answers[question._id] && answers[question._id] !== 0
            );
            
            if (unansweredQuestions.length > 0) {
                toast.error("Please answer all screening questions before proceeding.");
                return;
            }
            
            setCurrentScreen("resume");
        }
    };

    const handlePrevious = () => {
        if (currentScreen === "resume") {
            setCurrentScreen("questions");
        }
    };

    const handleAnswersChange = (newAnswers: Record<string, string | number>) => {
        setAnswers(newAnswers);
    };

    const handleFileChange = (file: File | null) => {
        setResumeFile(file);
    };

    const validateApplication = (): boolean => {
        // Check if all questions are answered
        const screeningQuestions = jobData.screeningQuestions || [];
        const unansweredQuestions = screeningQuestions.filter(
            (question) => question._id && !answers[question._id] && answers[question._id] !== 0
        );
        
        if (unansweredQuestions.length > 0) {
            toast.error("Please answer all screening questions.");
            return false;
        }

        // Check if resume is uploaded
        if (!resumeFile) {
            toast.error("Please upload your resume.");
            return false;
        }

        return true;
    };

    const handleSubmitApplication = async () => {
        if (!validateApplication()) {
            return;
        }

        if (!jobData._id) {
            toast.error('Job ID is missing. Please try again.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            
            // Add answers as JSON string with question text
            const answersArray: QuestionAnswer[] = Object.entries(answers).map(([questionId, answer]) => {
                const questionObj = jobData.screeningQuestions.find(q => q._id === questionId);
                return {
                    question: questionObj?.question || '',
                    answer
                };
            });

            console.log('Submitting application with:', {
                jobId: jobData._id,
                answersCount: answersArray.length,
                resumeFileName: resumeFile?.name,
                resumeFileSize: resumeFile?.size
            });

            const response = await AppApi.jobAction(jobData._id, 'applied', answersArray, resumeFile || undefined);

            const data = await response.data;

            if (!response.success) {
                toast.error(data.error);
                return;
            }

            toast.success('Application submitted successfully!');
            queryClient.invalidateQueries({ queryKey: ['jobs'], exact: false });
            
            // Reset form and close dialog
            handleClose();
            
        } catch  {
            toast.error('Failed to submit application. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset all form data
        setAnswers({});
        setResumeFile(null);
        setCurrentScreen("questions");
        setIsOpen(false);
    };

    const formatJobType = (type: string) => {
        switch (type) {
            case "full-time":
                return "Full-time";
            case "part-time":
                return "Part-time";
            case "contract":
                return "Contract";
            case "internship":
                return "Internship";
            default:
                return type;
        }
    };

    const formatExperienceLevel = (level: string) => {
        switch (level) {
            case "entry":
                return "Entry Level";
            case "mid":
                return "Mid Level";
            case "senior":
                return "Senior Level";
            default:
                return level;
        }
    };

    const canProceedToNext = () => {
        if (currentScreen === "questions") {
            // Add safety check for screeningQuestions
            const screeningQuestions = jobData.screeningQuestions || [];
            const unansweredQuestions = screeningQuestions.filter(
                (question) => question._id && !answers[question._id] && answers[question._id] !== 0
            );
            return unansweredQuestions.length === 0;
        }
        return true;
    };

    const canSubmit = () => {
        return resumeFile !== null && canProceedToNext();
    };

    // Add safety check before rendering questions screen
    const hasScreeningQuestions = jobData.screeningQuestions && jobData.screeningQuestions.length > 0;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger 
                className="bg-accent cursor-pointer hover:bg-accent/80 text-center h-full text-white py-2 rounded-full disabled:bg-gray-600 "
                disabled={jobData.isApplied || isSubmitting}
                onClick={() => setIsOpen(true)}
            >
                {jobData.isApplied ? "Applied" : "Apply"}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto hidden-scrollbar p-2">
                <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            Apply for {jobData.title}
                        </DialogTitle>
                        <DialogClose asChild>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close dialog"
                                onClick={handleClose}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </DialogClose>
                    </div>
                    
                    
                </DialogHeader>
                
                <div className="space-y-6 px-4">
                    {/* Progress indicator */}
                    <div className="flex items-center mt-4">
                        <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentScreen === "questions" 
                                    ? "bg-accent text-white" 
                                    : "bg-gray-200 text-black"
                            }`}>
                                1
                            </span>
                            <span className="ml-2 text-sm font-medium">Questions</span>
                        </div>
                        <div className="flex-1 mx-4 h-1 bg-gray-200 rounded">
                            <div className={`h-1 rounded transition-all duration-300 ${
                                currentScreen === "resume" ? "bg-accent w-full" : "bg-gray-200 w-0"
                            }`} />
                        </div>
                        <div className="flex items-center">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentScreen === "resume" 
                                    ? "bg-accent text-white" 
                                    : "bg-gray-200 text-gray-600"
                            }`}>
                                2
                            </span>
                            <span className="ml-2 text-sm font-medium">Resume</span>
                        </div>
                    </div>
                    {/* Job Details */}
                    <Card className="border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                            <CardTitle className="text-lg text-accent">
                                Job Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {jobData.companyLogo ? (
                                        <Image 
                                            src={jobData.companyLogo} 
                                            alt="Company Logo" 
                                            width={64} 
                                            height={64} 
                                            className="rounded-lg object-cover" 
                                        />
                                    ) : (
                                        <Image 
                                            src='/Logo.svg' 
                                            alt="SDG Logo" 
                                            width={64} 
                                            height={64} 
                                            className="rounded-lg object-cover" 
                                        />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                                        {jobData.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building className="w-4 h-4 text-gray-500" />
                                        <p className="text-gray-700 font-medium">
                                            {jobData.companyName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{jobData.location}</span>
                                        </div>
                                        {jobData.salaryRange && (
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{jobData.salaryRange}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{formatExperienceLevel(jobData.experienceLevel)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-accent">
                                            {formatJobType(jobData.jobType)}
                                        </Badge>
                                    </div>
                                    
                                    {jobData.skills && jobData.skills.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <h4 className="text-base font-semibold text-gray-900">
                                                Required Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {jobData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-accent hover:bg-accent/80 text-white px-3 py-1 text-sm font-medium rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Content Based on Current Screen */}
                    {currentScreen === "questions" && hasScreeningQuestions && (
                        <QuestionScreen 
                            questions={jobData.screeningQuestions}
                            onAnswersChange={handleAnswersChange}
                            initialAnswers={answers}
                        />
                    )}
                    
                    {/* Show message if no screening questions */}
                    {currentScreen === "questions" && !hasScreeningQuestions && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No screening questions for this position.</p>
                            <Button
                                onClick={() => setCurrentScreen("resume")}
                                className="bg-accent hover:bg-accent px-8 mt-4"
                            >
                                Continue to Resume Upload
                            </Button>
                        </div>
                    )}
                    
                    {currentScreen === "resume" && (
                        <ResumeUploadCard
                            onFileChange={handleFileChange}
                            initialFile={resumeFile}
                        />
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center py-4 border-t bg-white ">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            className="px-6"
                            disabled={currentScreen === "questions" || isSubmitting}
                        >
                            Previous
                        </Button>
                        
                        {currentScreen === "questions" ? (
                            <Button
                                onClick={handleNext}
                                className="bg-accent hover:bg-accent px-8"
                                disabled={(!hasScreeningQuestions ? false : !canProceedToNext()) || isSubmitting}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmitApplication}
                                className="bg-accent hover:bg-accent px-8"
                                disabled={!canSubmit() || isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>       
    );
};
