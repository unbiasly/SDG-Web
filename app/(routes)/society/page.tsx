'use client';
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import { ContentFeed } from "@/components/feed/ContentFeed";
import { PostWithImpressionTracking } from "@/components/feed/PostWithImpressionTracking";
import Loader from "@/components/Loader";
import UpdateCard from "@/components/society/UpdateCard";
import { SDG_SOCIETY_TABS } from "@/lib/constants/index-constants";
import { Event, PostsFetchResponse } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";



const Page = () => {
    const feedTabs = SDG_SOCIETY_TABS;
    const [activeSocietyTab, setActiveSocietyTab] = useState(feedTabs[0]);
    const [events, setEvents] = useState<Event[]>([]);
    const [talks, setTalks] = useState<Event[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [isLoadingTalks, setIsLoadingTalks] = useState(true);
    
    async function fetchPosts(cursor?: string): Promise<PostsFetchResponse> {
        const url = cursor ? `/api/post?cursor=${cursor}&type=sdg-society` : "/api/post?type=sdg-society";
        
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
            queryKey: ["society-posts"],
            queryFn: ({ pageParam }) => fetchPosts(pageParam),
            initialPageParam: "",
            getNextPageParam: (lastPage) => {
                return lastPage.pagination?.nextCursor || undefined;
            },
            gcTime: 0,
            staleTime: 0,
            enabled: true,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        });
    
    const posts = data?.pages.flatMap((page) => page.data) || [];
    const { ref, inView } = useInView();
    const queryClient = useQueryClient();

    const getSocietyEvents = async (type: 'event' | 'talk') => {
        try {
            if (type === 'event') setIsLoadingEvents(true);
            if (type === 'talk') setIsLoadingTalks(true);

            const response = await AppApi.getEvents(type, undefined);
            
            if (response.success && response.data) {
                if (type === 'event') {
                    setEvents(response.data.data);
                } else if (type === 'talk') {
                    setTalks(response.data.data);
                }
            }
        } catch (error) {
            console.error(`Failed to fetch society ${type}s:`, error);
        } finally {
            if (type === 'event') setIsLoadingEvents(false);
            if (type === 'talk') setIsLoadingTalks(false);
        }
    };

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    useEffect(() => {
        getSocietyEvents('event');
        getSocietyEvents('talk');
    }, []);
        
    if (status === "error") {
        return (
            <div className="flex flex-1 justify-center items-center h-screen">
                <p className="text-red-500">Error loading posts</p>
            </div>
        );
    }

    return (
        <div>
            <BackPageHeader headerTitle="The SDG Society" />
            <div className="py-2">
                <ContentFeed activeTab={activeSocietyTab} setActiveTab={setActiveSocietyTab} tabs={feedTabs}>
                    {status === "pending" ? (
                        <Loader />
                    ) : (
                        <>
                            {feedTabs && (
                                <>
                                    {activeSocietyTab === "Feed" && (
                                        <>
                                            <div className="px-4 space-y-4">
                                                {posts
                                                    .filter((post) => post !== undefined)
                                                    .map((post) => (
                                                        <PostWithImpressionTracking
                                                            key={post._id}
                                                            post={post}
                                                            onPostUpdate={() =>
                                                                queryClient.invalidateQueries({
                                                                    queryKey: ["society-posts"],
                                                                })
                                                            }
                                                        />
                                                    ))}

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

                                                {!hasNextPage && posts.length > 0 && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        ......
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {activeSocietyTab === "Updates" && (
                                        <div className="p-4 flex flex-col space-y-8">
                                            {/* SDG Talks Section */}
                                            <div className="flex flex-col space-y-4">
                                                <h1 className="text-accent text-2xl font-bold text-center">
                                                    SDG Talks
                                                </h1>
                                                {isLoadingTalks ? (
                                                    <div className="flex justify-center py-8">
                                                        <Loader />
                                                    </div>
                                                ) : talks.length > 0 ? (
                                                    <Carousel className="w-full max-w-lg mx-auto ">
                                                        <CarouselContent>
                                                            {talks.map((talk) => (
                                                                <CarouselItem key={talk._id}>
                                                                    <UpdateCard event={talk} />
                                                                </CarouselItem>
                                                            ))}
                                                        </CarouselContent>
                                                        {talks.length > 1 && (
                                                            <>
                                                                <CarouselPrevious />
                                                                <CarouselNext />
                                                            </>
                                                        )}
                                                    </Carousel>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>No SDG talks available</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Events Section */}
                                            <div className="flex flex-col space-y-4">
                                                <h1 className="text-accent text-2xl font-bold text-center">
                                                    Events
                                                </h1>
                                                {isLoadingEvents ? (
                                                    <div className="flex justify-center py-8">
                                                        <Loader />
                                                    </div>
                                                ) : events.length > 0 ? (
                                                    <Carousel className="w-full max-w-lg mx-auto">
                                                        <CarouselContent>
                                                            {events.map((event) => (
                                                                <CarouselItem key={event._id}>
                                                                    <UpdateCard event={event} />
                                                                </CarouselItem>
                                                            ))}
                                                        </CarouselContent>
                                                        {events.length > 1 && (
                                                            <>
                                                                <CarouselPrevious />
                                                                <CarouselNext />
                                                            </>
                                                        )}
                                                    </Carousel>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>No events available</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </ContentFeed>
            </div>
        </div>
    );
};

export default Page;
