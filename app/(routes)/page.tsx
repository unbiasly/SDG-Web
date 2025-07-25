"use client";
import { ContentFeed } from "@/components/feed/ContentFeed";
import CreatePost from "@/components/feed/CreatePost";
import SDGNews from "@/components/feed/SDGNews";
import { FEED_TABS, MOBILE_FEED_TABS } from "@/lib/constants/index-constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Loader from "@/components/Loader";
import { PostsFetchResponse } from "@/service/api.interface";
import { PostWithImpressionTracking } from "@/components/feed/PostWithImpressionTracking";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import the useMediaQuery hook
import { AppApi } from "@/service/app.api";

export default function Home() {
    const isMobile = useMediaQuery("(max-width: 1024px)");
    const getFeedTabs = (isMobile: boolean) => {
        return isMobile ? MOBILE_FEED_TABS : FEED_TABS;
    };

    const feedTabs = getFeedTabs(isMobile);
    const [activeTab, setActiveTab] = useState(feedTabs[0]);
    const { ref, inView } = useInView();


    async function fetchPosts(cursor?: string): Promise<PostsFetchResponse> {
        const response = await AppApi.fetchPosts(cursor);

        return response.data;
    }
    
    // Set up infinite query
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["posts"],
            queryFn: ({ pageParam }) => fetchPosts(pageParam),
            initialPageParam: "",
            getNextPageParam: (lastPage) => {
                // Extract the cursor from the pagination data
                return lastPage.pagination?.nextCursor || undefined;
            },
            gcTime: 0,
            staleTime: 0, // Ensures data is considered stale immediately
            enabled: true, // Enable the query
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnReconnect: false, // Disable refetch on reconnect
            
        });

    const queryClient = useQueryClient();

    const handlePostUpdate = () => {
        // Invalidate the posts query to refetch data
        queryClient.invalidateQueries({ queryKey: ["posts"] });
    };

    // Flatten the pages into a single array of posts
    const posts = data?.pages.flatMap((page) => page.data) || [];

    // Fetch next page when the load more element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);


    // Show error state
    if (status === "error") {
        return (
            <div className="flex flex-1 justify-center items-center h-screen">
                <p className="text-red-500">Error loading posts</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <ContentFeed
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={feedTabs}
            >
                {status === "pending" ? (
                    <Loader />
                ) : (
                    <>
                        {feedTabs && (
                            <>
                                {activeTab === "For You" && (
                                    <>
                                        <CreatePost />
                                        <div className="px-4 space-y-4">
                                            {posts
                                                .filter(
                                                    (post) => post !== undefined
                                                )
                                                .map((post) => (
                                                    <PostWithImpressionTracking
                                                        key={post._id}
                                                        post={post}
                                                        onPostUpdate={
                                                            handlePostUpdate
                                                        }
                                                    />
                                                ))}

                                            {/* Loading indicator and ref for intersection observer */}
                                            {(hasNextPage ||
                                                isFetchingNextPage) && (
                                                <div
                                                    className="flex justify-center py-4"
                                                    ref={ref}
                                                >
                                                    {isFetchingNextPage ? (
                                                        <div className="w-6 h-6 border-2 border-accent rounded-full border-t-transparent animate-spin"></div>
                                                    ) : (
                                                        <div className="h-16"></div>
                                                    )}
                                                </div>
                                            )}

                                            {/* End of content message */}
                                            {!hasNextPage &&
                                                posts.length > 0 && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        ......
                                                    </div>
                                                )}
                                        </div>
                                    </>
                                )}
                                {activeTab === "The SDG News" && <SDGNews />}
                            </>
                        )}
                    </>
                )}
            </ContentFeed>
        </div>
    );
}
