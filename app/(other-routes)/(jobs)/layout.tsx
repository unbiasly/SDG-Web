'use client'
import JobCard from '@/components/jobs/JobCard';
import JobSearch from '@/components/jobs/JobSearch';
import Loader from '@/components/Loader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { JOB_TABS } from '@/lib/constants/index-constants';
import { cn } from '@/lib/utils';
import { JobListing } from '@/service/api.interface';
import { AppApi } from '@/service/app.api';
import { current } from '@reduxjs/toolkit';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function JobsLayout({ children }: LayoutProps) {
    
    const [jobs, setJobs] = useState<JobListing[]>([]);
    const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
    const [activeTab, setActiveTab] = useState("preferences");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();
    const isInternshipPage = pathname.includes('/internship/') || pathname.includes('/internship');
    const isDetailPage = pathname.includes('/jobs/') || pathname.includes('/internship/');


    const mobileJobDetail = isMobile && selectedJob
    const router = useRouter();

    const tabs = JOB_TABS;

    // Extract job ID from pathname
    const getJobIdFromPath = () => {
        const match = pathname.match(/\/jobs\/([^\/]+)/);
        return match ? match[1] : null;
    };

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await AppApi.fetchJobs(undefined, undefined, isInternshipPage ? 'internship' : undefined, undefined, );
            
            if (!response.success) {
                throw new Error('Failed to fetch jobs');
            }

            const data = response.data;
            const jobsData = data.data || [];
            setJobs(jobsData);
            
            // Set selected job based on URL if we're on a detail page
            const jobId = getJobIdFromPath();
            if (jobId && jobsData.length > 0) {
                const foundJob = jobsData.find((job: JobListing) => job._id === jobId);
                if (foundJob) {
                    setSelectedJob(foundJob);
                }
            }
            
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError(err instanceof Error ? err.message : 'Failed to load jobs');
            setJobs([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle pathname changes to update selected job
    useEffect(() => {
        const jobId = getJobIdFromPath();
        
        if (jobId && jobs.length > 0) {
            const foundJob = jobs.find((job: JobListing) => job._id === jobId);
            if (foundJob && selectedJob?._id !== foundJob._id) {
                setSelectedJob(foundJob);
            }
        } else if (!jobId) {
            // Clear selected job when not on detail page
            setSelectedJob(null);
        }
    }, [pathname, jobs]);

    // Filter jobs based on search query
    const filteredJobs = useMemo(() => {
        if (!searchQuery.trim()) {
            return jobs;
        }

        const query = searchQuery.toLowerCase();
        return jobs.filter((job) => {
            return (
                job.title?.toLowerCase().includes(query) ||
                job.companyName?.toLowerCase().includes(query) ||
                job.location?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query)
            );
        });
    }, [jobs, searchQuery]);

    // Handle search query changes
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <Loader />
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex w-full min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                        Error Loading Jobs
                    </div>
                    <div className="text-gray-600 mb-4">{error}</div>
                    <button
                        onClick={fetchJobs}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full max-h-full">
            {/* Job Listings Panel */}
            <div className={`w-full md:min-w-2/5 border-r border-gray-200 overflow-y-auto ${mobileJobDetail ? 'hidden' : 'block'}`}>
                <div className="p-4">
                    <div className="mb-4">
                        <h1 className="text-2xl font-bold">{isInternshipPage ? 'Internships' : 'Jobs'}</h1>
                    </div>
                    <div className="flex space-x-1 mb-4 hidden-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-accent text-white"
                                        : "bg-white text-gray-700 border border-gray-300"
                                )}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    {/* Search Component */}
                    <JobSearch onSearch={handleSearch}/>
                    
                    {/* Search Results Summary */}
                    {searchQuery.trim() && (
                        <div className="mb-4 text-sm text-gray-600">
                            {filteredJobs.length > 0 ? (
                                <p>Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} matching "{searchQuery}"</p>
                            ) : (
                                <p>No jobs found matching "{searchQuery}"</p>
                            )}
                        </div>
                    )}
                    
                    {/* Jobs List */}
                    <div className="space-y-2">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    isSelected={selectedJob?._id === job._id}
                                    onClick={() => {
                                        setSelectedJob(job);
                                        router.push(`/${isInternshipPage ? 'internship' : 'jobs'}/${job._id}`); // Navigate to job detail page
                                    }}
                                />
                            ))
                        ) : searchQuery.trim() ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No jobs found for "{searchQuery}"</p>
                                <p className="text-sm">Try different keywords or clear your search</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No jobs available</p>
                                <p className="text-sm">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Job Detail Page */}
            <div className={`flex-1 ${isDetailPage ? 'block' : 'hidden'} md:min-w-3/5 overflow-auto`}>
                {children}
            </div>
        </div>
    );
};