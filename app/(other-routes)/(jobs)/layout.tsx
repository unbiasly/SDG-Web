'use client'
import JobCard from '@/components/jobs/JobCard';
import JobDialog from '@/components/jobs/JobDialog';
import JobSearch from '@/components/jobs/JobSearch';
import Loader from '@/components/Loader';
import { useMediaQuery } from '@/hooks/use-media-query';
import { JOB_TABS } from '@/lib/constants/index-constants';
import { cn } from '@/lib/utils';
import { JobListing } from '@/service/api.interface';
import { AppApi } from '@/service/app.api';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

interface LayoutProps {
    children: React.ReactNode;
}

export default function JobsLayout({ children }: LayoutProps) {
    
    const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
    const [activeTab, setActiveTab] = useState("preferences");
    const [searchQuery, setSearchQuery] = useState("");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();
    const isInternshipPage = pathname.includes('/internship/') || pathname.includes('/internship');
    const isDetailPage = pathname.includes('/jobs/') || pathname.includes('/internship/');

    const mobileJobDetail = isMobile && selectedJob
    const router = useRouter();

    // Add this helper to check if we're on a detail page
    const isOnDetailPage = pathname.includes('/jobs/') || pathname.includes('/internship/');
    const shouldShowDetailPage = isOnDetailPage || (!isMobile && isDetailPage);

    const tabs = JOB_TABS;

    // Extract job ID from pathname
    const getJobIdFromPath = () => {
        const match = pathname.match(/\/jobs\/([^\/]+)/);
        return match ? match[1] : null;
    };

    // Infinite query for jobs
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useInfiniteQuery({
        queryKey: ['jobs', isInternshipPage ? 'internship' : 'job'],
        queryFn: async ({ pageParam = null }) => {
            const response = await AppApi.fetchJobs(
                pageParam || undefined, 
                undefined, 
                isInternshipPage ? 'internship' : undefined, 
                undefined
            );
            
            if (!response.success) {
                throw new Error('Failed to fetch jobs');
            }
            
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            // Use nextCursor from pagination to determine next page
            return lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor : undefined;
        },
        initialPageParam: null,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Flatten all jobs from all pages
    const jobs = useMemo(() => {
        return data?.pages.flatMap(page => page.data || []) || [];
    }, [data]);

    // Handle pathname changes to update selected job and refetch if needed
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
    }, [pathname, jobs, selectedJob?._id]);

    // Refetch when switching between jobs and internships
    useEffect(() => {
        refetch();
    }, [isInternshipPage, refetch]);

    // Filter jobs based on search query
    const filteredJobs = useMemo(() => {
        // First filter out applied jobs
        const unappliedJobs = jobs.filter(job => !job.isApplied);
        
        if (!searchQuery.trim()) {
            return unappliedJobs;
        }

        const query = searchQuery.toLowerCase();
        return unappliedJobs.filter((job) => {
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

    // Handle infinite scroll
    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Loader />
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex w-full h-screen items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                        Error Loading Jobs
                    </div>
                    <div className="text-gray-600 mb-4">{error?.message || 'Failed to load jobs'}</div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-accent text-white rounded-md"
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
            <div className={`w-full md:min-w-2/5 border-r border-gray-200 hidden-scrollbar  overflow-y-auto ${(mobileJobDetail || (isMobile && isOnDetailPage)) ? 'hidden' : 'block'}`}>
                <div className="p-4">
                    <div className="mb-4 space-y-2">
                        <h1 className="text-2xl font-bold ">{isInternshipPage ? 'Internships' : 'Jobs'}</h1>
                        <JobDialog/>
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
                    <div className="space-y-2 overflow-y-auto hidden-scrollbar">
                        {activeTab === "preferences" && (
                            filteredJobs.length > 0 ? (
                                <>
                                    {filteredJobs.map((job) => (
                                        <JobCard
                                            key={job._id}
                                            job={job}
                                            isSelected={selectedJob?._id === job._id}
                                            onClick={() => {
                                                setSelectedJob(job);
                                                router.push(`/${isInternshipPage ? 'internship' : 'jobs'}/${job._id}`); // Navigate to job detail page
                                            }}
                                        />
                                    ))}
                                    {/* Load More Button */}
                                    {hasNextPage && (
                                        <div className="flex justify-center pt-4">
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={isFetchingNextPage}
                                                className="px-4 py-2 bg-accent text-white rounded-full hover:bg-accent/80 disabled:opacity-50"
                                            >
                                                {isFetchingNextPage ? 'Loading...' : 'Load More'}
                                            </button>
                                        </div>
                                    )}
                                </>
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
                            )
                        )}
                        {activeTab === "applied" && (
                            jobs.filter(job => job.isApplied).length > 0 ? (
                                jobs.filter(job => job.isApplied).map((job) => (
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
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No applied jobs found</p>
                                    <p className="text-sm">You haven't applied to any jobs yet</p>
                                </div>
                            )
                        )}
                        {activeTab === "saved" && (
                            jobs.filter(job => job.isSaved).length > 0 ? (
                                jobs.filter(job => job.isSaved).map((job) => (
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
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No saved jobs found</p>
                                    <p className="text-sm">You haven't saved any jobs yet</p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Job Detail Page */}
            <div className={`flex-1 ${shouldShowDetailPage ? 'block' : 'hidden'} md:min-w-3/5 overflow-auto`}>
                {children}
            </div>
        </div>
    );
};