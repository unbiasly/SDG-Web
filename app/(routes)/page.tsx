"use client";
import { ContentFeed } from "@/components/feed/ContentFeed";
import CreatePost from "@/components/feed/CreatePost";
import SDGNews from "@/components/feed/SDGNews";
import { FEED_TABS, MOBILE_FEED_TABS } from "@/lib/constants/index-constants";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Loading from "@/components/Loader";
import { PostsFetchResponse } from "@/service/api.interface";
import { PostWithImpressionTracking } from "@/components/feed/PostWithImpressionTracking";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import the useMediaQuery hook

export default function Home() {
    const isMobile = useMediaQuery("(max-width: 1024px)");
    const getFeedTabs = (isMobile: boolean) => {
        return isMobile ? MOBILE_FEED_TABS : FEED_TABS;
    };

    const feedTabs = getFeedTabs(isMobile);
    const [activeTab, setActiveTab] = React.useState(feedTabs[0]);
    const { ref, inView } = useInView();

    async function fetchPosts(cursor?: string): Promise<PostsFetchResponse> {
        const url = cursor ? `/api/post?cursor=${cursor}` : "/api/post";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        return response.json();
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
            staleTime: 60 * 1000, // 1 minute
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

    // Show loading state
    if (status === "pending") {
        return (
            <div className="flex-1 bg-white bg-opacity-75 z-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

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
                {feedTabs && (
                    <>
                        {activeTab === "For You" && (
                            <>
                                <CreatePost />
                                <div className="px-4 space-y-4">
                                    {posts
                                        .filter((post) => post !== undefined)
                                        .map((post) => (
                                            <PostWithImpressionTracking
                                                key={post._id}
                                                post={post}
                                                onPostUpdate={handlePostUpdate}
                                            />
                                        ))}

                                    {/* Loading indicator and ref for intersection observer */}
                                    {(hasNextPage || isFetchingNextPage) && (
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
                                    {!hasNextPage && posts.length > 0 && (
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
            </ContentFeed>
        </div>
    );
}
