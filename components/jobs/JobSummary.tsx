import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit2, Calendar, MapPin, Building, Users, IndianRupee } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { JobListing, ScreeningQuestion } from "@/service/api.interface";

interface JobSummaryProps {
    jobData: JobListing;
    onEdit: () => void;
    onPost: () => void;
}

export const JobSummary: React.FC<JobSummaryProps> = ({ jobData, onEdit, onPost }) => {
    const [isPosting, setIsPosting] = useState(false);

    const formatWorkplaceType = (type: string) => {
        switch (type) {
            case "onsite":
                return "On-site";
            case "remote":
                return "Remote";
            case "hybrid":
                return "Hybrid";
            default:
                return type;
        }
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePost = async () => {
        setIsPosting(true);
        try {
            // Map form data to backend expected format
            const jobPayload = {
                title: jobData.title,
                companyName: jobData.companyName,
                location: jobData.location,
                jobType: jobData.jobType,
                salaryRange: jobData.salaryRange,
                experienceLevel: jobData.experienceLevel,
                description: jobData.description,
                applyUrl: jobData.applyUrl,
                ...(jobData.expiresAt && { expiresAt: jobData.expiresAt }),
                ...(jobData.companyLogo && { companyLogo: jobData.companyLogo }),
                ...(jobData.tags && jobData.tags.length > 0 && { tags: jobData.tags }),
                ...(jobData.screeningQuestions.length > 0 && { screeningQuestions: jobData.screeningQuestions }),
            };

            const response = await fetch('/api/jobs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || 'Failed to create job');
                return;
            }

            toast.success('Job posted successfully!');
            onPost(); // Close dialog and cleanup
        } catch (error) {
            console.error('Error posting job:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Job Details */}
            <Card className="border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                    <CardTitle className="text-lg text-accent">
                        Job Details
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        className="text-accent"
                    >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
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
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-4 h-4" />
                                    <span>{jobData.salaryRange}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{formatExperienceLevel(jobData.experienceLevel)}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-accent">
                                    {formatJobType(jobData.jobType)}
                                </Badge>
                                {/* <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    {formatWorkplaceType(jobData.workplaceType)}
                                </Badge> */}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Skills & Tags Section (if tags exist) */}
            {jobData.tags && jobData.tags.length > 0 && (
                <Card className="border-gray-200">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg text-gray-900">
                            Skills & Tags
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Required skills and tags for this position
                        </p>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                            {jobData.tags.map((tag:string, index:number) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-accent hover:bg-accent/80 text-white px-3 py-1 text-sm font-medium"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Job Description */}
            <Card className="border-gray-200">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg text-gray-900">
                        Job Description
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {jobData.description ? (
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {jobData.description}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">
                            No job description provided
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Additional Details */}
            <Card className="border-gray-200">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg text-gray-900">
                        Additional Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">Apply URL:</span>
                        <a 
                            href={jobData.applyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent underline text-sm"
                        >
                            {jobData.applyUrl.length > 40 
                                ? `${jobData.applyUrl.substring(0, 40)}...` 
                                : jobData.applyUrl
                            }
                        </a>
                    </div>
                    
                    {jobData.expiresAt && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700">Expires:</span>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(jobData.expiresAt)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Screening Questions */}
            {jobData.screeningQuestions && jobData.screeningQuestions.length > 0 && (
                <Card className="border-gray-200">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg text-gray-900">
                            Screening Questions
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Applicants will be required to answer these questions
                        </p>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            {jobData.screeningQuestions.map((questionObj: ScreeningQuestion, index:number) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-lg border-l-4 border-accent"
                                >
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-gray-700 flex-1">
                                            {index + 1}. {questionObj.question}
                                        </p>
                                        {questionObj.type && (
                                            <Badge 
                                                variant="outline" 
                                                className="ml-3 text-xs bg-accent text-white border-accent"
                                            >
                                                {questionObj.type}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
                <Button
                    variant="outline"
                    onClick={onEdit}
                    className="px-6"
                    disabled={isPosting}
                >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Job
                </Button>
                
                <Button
                    onClick={handlePost}
                    disabled={isPosting}
                    className="bg-accent hover:bg-accent px-8"
                >
                    {isPosting ? "Posting..." : "Post Job"}
                </Button>
            </div>
        </div>
    );
};