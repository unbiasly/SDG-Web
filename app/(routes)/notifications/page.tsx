"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import Loader from '@/components/Loader';
import Alerts from '@/components/notification/Alerts';
import { NOTIFICATION_TABS } from '@/lib/constants/index-constants';
import { Notification } from '@/service/api.interface';
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

const Page = () => {
    const [activeTab, setActiveTab] = useState("Posts");
    const { ref, inView } = useInView();
    
    // Track which tabs have been visited to avoid unnecessary refetches
    const visitedTabs = useRef<Set<string>>(new Set(["Posts"]));

    // Map tab names to category values more explicitly
    const getCategory = (tabName: string) => {
        switch (tabName) {
            case "Posts":
                return "post";
            case "Job Alerts":
                return "job";
            case "SDG Talks":
                return "sdg-video";
            case "SDG News":
                return "sdg-news";
            default:
                return "post";
        }
    };

    // Get the current category value based on active tab
    const currentCategory = useMemo(() => getCategory(activeTab), [activeTab]);

    // Define the fetchNotifications function that will be used by useInfiniteQuery
    const fetchNotifications = async ({ pageParam = null }) => {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 30,
                cursor: pageParam,
                category: currentCategory,
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    };

    // Use infinite query hook with the category as part of the query key
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['notifications', currentCategory],
        queryFn: fetchNotifications,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
        // Only fetch initially if this tab hasn't been visited before
        enabled: true,
        // Keep the data fresh for 5 minutes (adjust as needed for your use case)
        staleTime: 5 * 60 * 1000, 
        // Persist cached data when component unmounts
        gcTime: 10 * 60 * 1000,
    });

    // Handle tab change with callback to track visited tabs
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        visitedTabs.current.add(tab);
    };

    // Fetch next page when the load more element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Get all notifications across pages
    const allNotifications = data?.pages.flatMap(page => page.data) || [];
    
    // No need for additional filtering since the API already returns filtered results
    const displayNotifications = allNotifications;

    return (
        <div className='flex flex-1 min-h-screen'>
            <ContentFeed 
                activeTab={activeTab} 
                setActiveTab={handleTabChange} 
                tabs={NOTIFICATION_TABS}
            >
                <>
                    {isLoading && allNotifications.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader/>
                        </div>
                    ) : status === "error" ? (
                        <div className="text-red-500 p-4 text-center">
                            {error instanceof Error ? error.message : "Failed to load notifications. Please try again later."}
                        </div>
                    ) : displayNotifications.length > 0 ? (
                        <>
                            {displayNotifications.map((notif, index) => (
                                <Alerts
                                    key={index}
                                    _id={notif._id}
                                    type={notif.type}
                                    message={notif.message}
                                    isRead={notif.isRead}
                                    post={notif.post}
                                    category={notif.category}
                                    userProfile={notif.userProfile}
                                />
                            ))}
                            
                            {/* Invisible element to trigger next page load */}
                            <div 
                                ref={ref}
                                className="h-10 w-full"
                                aria-hidden="true"
                            >
                                {isFetchingNextPage && (
                                    <div className="flex justify-center py-4">
                                        <Loader />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            No notifications found for {activeTab}
                        </div>
                    )}

                    {!hasNextPage && allNotifications.length > 0 && (
                        <div className="text-center mx-20 rounded-full border-gray-600 border-2 text-gray-500"/>
                    )}
                </>
            </ContentFeed>
        </div>
    )
}

export default Page