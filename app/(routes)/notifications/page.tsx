"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import Loader from '@/components/Loader';
import Alerts from '@/components/notification/Alerts';
import { NOTIFICATION_TABS } from '@/lib/constants/index-constants';
import { Notification } from '@/service/api.interface';
import React, { useState, useEffect } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<{
        hasMore: boolean;
        nextCursor: string | null;
    }>({
        hasMore: false,
        nextCursor: null
    });

    useEffect(() => {
        fetchNotifications();
    }, [activeTab]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    limit: 10,
                    cursor: null,
                    category: activeTab !== "All" ? activeTab.toLowerCase() : null
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            
            if (responseData.success) {
                setNotifications(responseData.data);
                setPagination({
                    hasMore: responseData.pagination.hasMore,
                    nextCursor: responseData.pagination.nextCursor
                });
                setError(null);
            } else {
                throw new Error("Failed to load notifications");
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError("Failed to load notifications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    // Filter notifications based on active tab
    const filteredNotifications = activeTab === "All" 
        ? notifications 
        : notifications.filter(notif => notif.category === activeTab.toLowerCase());

    // Function to load more notifications
    const loadMore = async () => {
        if (!pagination.hasMore || !pagination.nextCursor) return;
        
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    limit: 10,
                    cursor: pagination.nextCursor,
                    // category: activeTab !== "All" ? activeTab.toLowerCase() : null
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch more notifications`);
            }
            
            const responseData = await response.json();
            
            if (responseData.success) {
                setNotifications(prev => [...prev, ...responseData.data]);
                setPagination({
                    hasMore: responseData.pagination.hasMore,
                    nextCursor: responseData.pagination.nextCursor
                });
            }
        } catch (err) {
            console.error("Error loading more notifications:", err);
        }
    };

    return (
        <div className='flex flex-1 min-h-screen'>
            <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={NOTIFICATION_TABS}>
                <>
                    {loading && notifications.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader/>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 p-4 text-center">{error}</div>
                    ) : filteredNotifications.length > 0 ? (
                        <>
                            {filteredNotifications.map((notif) => (
                                <Alerts
                                    key={notif._id}
                                    _id={notif._id}
                                    type={notif.type}
                                    message={notif.message}
                                    isRead={notif.isRead}
                                    post={notif.post}
                                    category={notif.category}
                                    userProfile={notif.userProfile}
                                />
                            ))}
                            
                            {pagination.hasMore && (
                                <button 
                                    onClick={loadMore}
                                    className="w-full py-3 text-center text-blue-600 hover:text-blue-800"
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-8 text-gray-500">
                            No notifications found for {activeTab}
                        </div>
                    )}
                </>
            </ContentFeed>
        </div>
    )
}

export default Page