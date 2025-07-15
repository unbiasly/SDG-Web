'use client';
import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { REPORT_TABS } from "@/lib/constants/index-constants";
import { SDG_Report } from "@/service/api.interface";
import ReportCard from "@/components/reports/ReportCard";
import { AppApi } from "@/service/app.api";

interface ReportsApiResponse {
    success: boolean;
    data: SDG_Report[];
    pagination: {
        limit: string;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
        totalItems: number;
    };
}

const Page = () => {
    const [activeTab, setActiveTab] = useState("NITI Aayog");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = REPORT_TABS;

    // Map tab names to category values for filtering
    const getCategoryFromTab = (tab: string): string => {
        switch (tab) {
            case "UNDP":
                return "undp";
            case "NITI Aayog":
                return "niti-aayog";
            case "State":
                return "state";
            case "Ministry":
                return "ministry";
            default:
                return "";
        }
    };

    // TanStack Query for infinite loading
    const fetchReports = async ({ pageParam = null }: { pageParam: string | null }) => {
        try {
            console.log("Fetching reports with cursor:", pageParam);
            
            // Call AppApi.getReports with cursor parameter
            const response = await AppApi.getReports(undefined, pageParam);
            
            console.log("API Response:", response);
            
            // The response from AppApi.getReports should already be the parsed data
            // Check if response has the expected structure
            if (response && typeof response === 'object') {
                // If response is already the parsed data, return it directly
                return response as ReportsApiResponse;
            }
            
            throw new Error("Invalid response structure");
        } catch (error) {
            console.error("Error fetching reports:", error);
            throw error;
        }
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useInfiniteQuery({
        queryKey: ['reports'],
        queryFn: fetchReports,
        initialPageParam: null,
        getNextPageParam: (lastPage: ReportsApiResponse) => {
            console.log("Last page pagination:", lastPage.pagination);
            
            // Return nextCursor if hasMore is true, otherwise return undefined to stop fetching
            if (lastPage.pagination?.hasMore && lastPage.pagination?.nextCursor) {
                console.log("Next cursor:", lastPage.pagination.nextCursor);
                return lastPage.pagination.nextCursor;
            }
            
            console.log("No more pages to fetch");
            return undefined;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
    });

    // Flatten all pages into a single array and filter by category and search
    const allReports = useMemo(() => {
        if (!data?.pages) return [];
        
        console.log("Processing pages:", data.pages.length);
        
        // Flatten all pages
        const flattenedReports = data.pages.flatMap(page => {
            console.log("Page data:", page.data?.length || 0, "reports");
            return page.data || [];
        });
        
        console.log("Total reports after flattening:", flattenedReports.length);
        
        const selectedCategory = getCategoryFromTab(activeTab);
        
        // Filter by category first
        const categoryFilteredReports = selectedCategory 
            ? flattenedReports.filter(report => 
                report.category === selectedCategory.toLowerCase()
            )
            : flattenedReports;
        
        console.log("Reports after category filter:", categoryFilteredReports.length);
        
        // Then filter by search query
        if (searchQuery.trim()) {
            const searchFiltered = categoryFilteredReports.filter(report =>
                report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log("Reports after search filter:", searchFiltered.length);
            return searchFiltered;
        }
        
        return categoryFilteredReports;
    }, [data?.pages, activeTab, searchQuery]);

    // Load more function
    const loadMore = () => {
        // console.log("Load more clicked. hasNextPage:", hasNextPage, "isFetchingNextPage:", isFetchingNextPage);
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Handle scroll to bottom for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage]);

    // Debug logging
    useEffect(() => {
        console.log("Query state:", {
            isLoading,
            isError,
            hasNextPage,
            isFetchingNextPage,
            pagesCount: data?.pages?.length || 0,
            allReportsCount: allReports.length
        });
    }, [isLoading, isError, hasNextPage, isFetchingNextPage, data?.pages?.length, allReports.length]);

    return (
        <div className="min-h-screen flex-1 p-4 md:p-6">
            {/* Search Bar */}
            <div className="relative max-w-4xl mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter report name to search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 md:h-14 pl-6 pr-14 text-base md:text-lg rounded-full border-2 border-gray-200 bg-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-300 mb-8">
                <div className="flex w-full justify-evenly overflow-x-auto">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={tab}>
                            <div className={`py-3 px-2 flex-shrink-0 ${
                                activeTab === tab 
                                    ? 'border-b-3 border-b-accent text-accent' 
                                    : 'border-b-2 text-gray-400 border-b-transparent'
                            }`}>
                                <button
                                    className={`cursor-pointer text-sm md:text-lg lg:text-xl whitespace-nowrap transition-colors ${
                                        activeTab === tab ? 'font-bold text-accent' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            </div>
                            {index < tabs.length - 1 && (
                                <div className="my-2 border-r border-gray-300" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="mx-auto">
                {/* Initial Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">
                            {error instanceof Error ? error.message : "Failed to load reports"}
                        </p>
                        <button 
                            onClick={() => refetch()}
                            className="mt-4 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && allReports.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchQuery ? 
                                `No reports found matching "${searchQuery}"` : 
                                `No reports available for ${activeTab}`
                            }
                        </p>
                    </div>
                )}

                {/* Reports Grid */}
                {!isLoading && !isError && allReports.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                            {allReports.map((report) => (
                                <ReportCard
                                    key={report._id}
                                    _id={report._id}
                                    title={report.title}
                                    category={report.category}
                                    createdAt={report.createdAt}
                                    report_url={report.report_url}
                                    thumbnail_url={report.thumbnail_url}
                                    updatedAt={report.updatedAt}
                                    status={report.status}
                                />
                            ))}
                        </div>

                        {/* Load More Button or Loading Indicator */}
                        <div className="flex justify-center mt-8">
                            {isFetchingNextPage ? (
                                <div className="flex items-center gap-2 py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
                                    <span className="text-gray-600">Loading more reports...</span>
                                </div>
                            ) : hasNextPage ? (
                                <button
                                    onClick={loadMore}
                                    className="p-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                                >
                                    Load More Reports
                                </button>
                            ) : allReports.length > 0 ? (
                                <p className="text-gray-500 py-4">No more reports to load</p>
                            ) : null}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;