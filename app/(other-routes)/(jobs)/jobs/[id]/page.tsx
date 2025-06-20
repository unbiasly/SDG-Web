"use client";
import JobDetail from "@/components/jobs/JobDetail";
import Loader from "@/components/Loader";
import { useMediaQuery } from "@/hooks/use-media-query";
import { JobListing } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const [job, setJob] = useState<JobListing | null>(null);
    const [savePressed, setSavePressed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const jobId = use(params).id;
    const isMobile = useMediaQuery("(max-width: 768px)");

    const fetchJobById = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await AppApi.fetchJobs(undefined, undefined, undefined, id);
            
            if (!response.success) {
                throw new Error('Failed to fetch job details');
            }

            const jobData = response.data?.data;
            
            if (jobData) {
                setJob(jobData);
                setSavePressed(jobData.isSaved || false);
            } else {
                throw new Error('Job not found');
            }
            
            console.log("Job fetched:", jobData);
        } catch (err) {
            console.error("Error fetching job:", err);
            setError(err instanceof Error ? err.message : 'Failed to load job');
            setJob(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) {
            fetchJobById(jobId);
        } else {
            setError('No job ID provided');
            setIsLoading(false);
        }
    }, [jobId, savePressed, job?.isApplied]);

    const handleGoBack = () => {
        if (isMobile) {
            router.back();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex w-full h-full overflow-hidden items-center justify-center">
                <Loader />
            </div>
        );
    }


    // Error state
    if (error) {
        return (
            <div className="flex w-full h-full">
                <div className="flex-1 overflow-y-auto">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-6">
                            {isMobile && (
                                <ArrowLeft className="w-5 h-5 mr-2 cursor-pointer" onClick={handleGoBack} />
                            )}
                            
                            <div className="text-red-500 text-lg font-semibold mb-2">
                                {error}
                            </div>
                            <div className="text-gray-600 mb-4">
                                The job you're looking for might have been removed or doesn't exist.
                            </div>
                            <button
                                onClick={() => jobId && fetchJobById(jobId)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/jobs')}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Back to Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full">
            {/* Job Detail Panel */}
            {job ? (
                <div className="flex-1 overflow-y-auto hidden-scrollbar relative">
                    {/* Mobile back button */}
                    {isMobile && (
                        <div className=" bg-white z-10 ">
                            {isMobile && (
                                <div className=" bg-white z-10 p-4 ">
                                    <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleGoBack} />
                                </div>
                            )}
                        </div>
                    )}
                    
                    <JobDetail job={job} onSave={(jobId: string) => setSavePressed(!savePressed)}/>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <p className="text-lg mb-2">Job not found</p>
                        <button
                            onClick={() => router.push('/jobs')}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Browse Jobs
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
