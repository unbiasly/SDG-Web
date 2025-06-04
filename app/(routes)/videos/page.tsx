"use client";
import { ContentFeed } from "@/components/feed/ContentFeed";
import VideoCard from "@/components/video/VideoCard";
import { VIDEO_TABS } from "@/lib/constants/index-constants";
import { useUser } from "@/lib/redux/features/user/hooks";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Loading from "@/components/Loader";
import { SDGVideoResponse } from "@/service/api.interface";

const Page = () => {
    const [activeVideoTab, setActiveVideoTab] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTab = localStorage.getItem("activeVideoTab");
            return savedTab ? savedTab : "The SDG Talks";
        }
        return "The SDG Talks";
    });
    const { ref, inView } = useInView();
    const { user } = useUser();
    const queryClient = useQueryClient();

    // Add state for tracking which video is currently playing
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("activeVideoTab", activeVideoTab);
        }
    }, [activeVideoTab]);

    const getVideoType = useMemo(() => {
        if (activeVideoTab === "The SDG Talks") return "talk";
        if (activeVideoTab === "The SDG Podcast") return "podcast";
        return "talk"; // default
    }, [activeVideoTab]);

    const fetchVideos = async ({
        pageParam = "",
        type = "talk",
        limit = 30,
    }): Promise<SDGVideoResponse> => {
        const response = await fetch("/api/video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                cursor: pageParam,
                limit,
                type,
                userId: user?._id,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch videos");
        }

        return response.json();
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["sdgVideos", getVideoType, user?._id],
        queryFn: ({ pageParam }) =>
            fetchVideos({
                pageParam,
                type: getVideoType,
                limit: 30,
            }),
        initialPageParam: "",
        getNextPageParam: (lastPage: SDGVideoResponse) =>
            lastPage.pagination?.nextCursor || undefined,
        enabled: !!user?._id, // Only enable when user is available
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    // Simple tab change handler
    const handleTabChange = useCallback(
        (newTab: string) => {
            setActiveVideoTab(newTab);
            setPlayingVideoId(null); // Close any playing videos
        },
        []
    );

    // Memoize video data to prevent unnecessary re-renders
    const videos = useMemo(
        () => data?.pages.flatMap((page) => page.data) || [],
        [data?.pages]
    );

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
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">
                    Error loading{" "}
                    {getVideoType === "talk" ? "videos" : "podcasts"}
                </p>
                <button 
                    onClick={() => refetch()} 
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-1">
            <ContentFeed
                activeTab={activeVideoTab}
                setActiveTab={handleTabChange}
                tabs={VIDEO_TABS}
            >
                <div className="grid grid-cols-1 md:grid-cols-1 px-4 gap-4">
                    {videos.map((video) => (
                        <div className="px-0" key={video._id}>
                            <VideoCard
                                video={video}
                                playingVideoId={playingVideoId}
                                setPlayingVideoId={setPlayingVideoId}
                                onBookmarkToggle={() => {
                                    // Invalidate and refetch current tab data
                                    queryClient.invalidateQueries({
                                        queryKey: ["sdgVideos", getVideoType, user?._id],
                                        exact: false,
                                    });
                                }}
                            />
                        </div>
                    ))}

                    {/* Loading indicator and ref for intersection observer */}
                    {(hasNextPage || isFetchingNextPage) && (
                        <div
                            className="col-span-full flex justify-center py-4"
                            ref={ref}
                        >
                            {isFetchingNextPage ? (
                                <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            ) : (
                                <div className="h-16"></div>
                            )}
                        </div>
                    )}

                    {/* End of content message */}
                    {!hasNextPage && videos.length > 0 && (
                        <div className="col-span-full text-center py-4 text-gray-500">
                            You've reached the end
                        </div>
                    )}

                    {/* Empty state */}
                    {videos.length === 0 && !isFetchingNextPage && (
                        <div className="col-span-full flex flex-col items-center justify-center py-10">
                            <p className="text-xl text-gray-500">
                                No{" "}
                                {getVideoType === "talk"
                                    ? "videos"
                                    : "podcasts"}{" "}
                                available
                            </p>
                        </div>
                    )}
                </div>
            </ContentFeed>
        </div>
    );
};

export default Page;
