"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import Loader from '@/components/Loader';
import Alerts from '@/components/notification/Alerts';
import { NOTIFICATION_TABS } from '@/lib/constants/index-constants';
import { Notification } from '@/service/api.interface';
import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

const Page = () => {
    const [activeTab, setActiveTab] = useState("All");
    const { ref, inView } = useInView();

    // Define the fetchNotifications function that will be used by useInfiniteQuery
    const fetchNotifications = async ({ pageParam = null }) => {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 10,
                cursor: pageParam,
                category: activeTab !== "All" ? activeTab.toLowerCase() : null
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    };

    // Use infinite query hook
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['notifications', activeTab],
        queryFn: fetchNotifications,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
        enabled: true,
    });

    // Refetch when active tab changes
    useEffect(() => {
        refetch();
    }, [activeTab, refetch]);

    // Fetch next page when the load more element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Get all notifications across pages
    const allNotifications = data?.pages.flatMap(page => page.data) || [];
    
    // Filter notifications based on active tab
    const filteredNotifications = activeTab === "All" 
        ? allNotifications 
        : allNotifications.filter(notif => notif.category === activeTab.toLowerCase());

    return (
        <div className='flex flex-1 min-h-screen'>
            <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={NOTIFICATION_TABS}>
                <>
                    {isLoading && allNotifications.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader/>
                        </div>
                    ) : status === "error" ? (
                        <div className="text-red-500 p-4 text-center">
                            {error instanceof Error ? error.message : "Failed to load notifications. Please try again later."}
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        <>
                            {filteredNotifications.map((notif, index) => (
                                <Alerts
                                    key={notif._id || index}
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