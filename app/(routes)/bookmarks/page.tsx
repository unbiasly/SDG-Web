"use client";
import { BOOKMARKS_TABS } from "@/lib/constants/index-constants";
import { cn } from "@/lib/utils";
import { formatSDGLink } from "@/lib/utilities/sdgLinkFormat";
import {
    PostBookmarkData,
    SDGArticleData,
    SDGVideoData,
    JobListing,
} from "@/service/api.interface";
import { ArrowLeft, Bookmark } from "lucide-react";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PostCard } from "@/components/feed/PostCard";
import VideoCard from "@/components/video/VideoCard";
import JobCard from "@/components/jobs/JobCard";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNewsBookmarkSync } from "@/hooks/useNewsBookmarkSync";
import { formatDate } from "@/lib/utilities/formatDate";
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import { AppApi } from "@/service/app.api";

// Define pagination interface
interface Pagination {
    limit: string;
    cursor: string | null;
    nextCursor: string | null;
    hasMore: boolean;
}

// Response interfaces
interface BookmarkResponse<T> {
    data: T[];
    pagination: Pagination;
}

// Wrap the main component with QueryClientProvider
const BookmarksPage = () => {
    return <BookmarksContent />; // Render BookmarksContent directly
};

const BookmarksContent = () => {
    const queryClient = useQueryClient(); // This will now get the global QueryClient
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

    useEffect(() => {
        // Invalidate all bookmark queries when component mounts
        queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
        queryClient.invalidateQueries({ queryKey: ["bookmarkedNews"] });
        queryClient.invalidateQueries({ queryKey: ["bookmarkedVideos"] });
        queryClient.invalidateQueries({ queryKey: ["bookmarkedJobs"] });
    }, [queryClient]);

    // Define fetch functions for each bookmark type
    const fetchPosts = async ({
        pageParam = null,
    }: {
        pageParam?: string | null;
    }) => {
        const response = await AppApi.fetchPosts(pageParam || undefined, undefined, true);
        if (!response.success) throw new Error("Failed to fetch post bookmarks");
        return response.data;

    };

    const fetchNews = async ({
        pageParam = null,
    }: {
        pageParam?: string | null;
    }) => {
        const url = new URL("/api/sdgNews/bookmark", window.location.origin);
        if (pageParam) url.searchParams.append("cursor", pageParam);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch news bookmarks");

        return response.json() as Promise<BookmarkResponse<SDGArticleData>>;
    };

    const fetchVideos = async ({
        pageParam = null,
    }: {
        pageParam?: string | null;
    }) => {
        const url = new URL("/api/video/bookmark", window.location.origin);
        if (pageParam) url.searchParams.append("cursor", pageParam);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch video bookmarks");

        return response.json() as Promise<BookmarkResponse<SDGVideoData>>;
    };

    // Fetch jobs function similar to layout.tsx
    const fetchJobs = async ({
        pageParam = null,
    }: {
        pageParam?: string | null;
    }) => {
        const response = await AppApi.fetchJobs(
            pageParam || undefined, 
            undefined, 
            undefined, // Don't filter by type for bookmarks
            undefined
        );
        
        if (!response.success) {
            throw new Error('Failed to fetch jobs');
        }
        
        return response.data;
    };

    // Set up infinite queries
    const {
        data: postsData,
        fetchNextPage: fetchNextPosts,
        hasNextPage: hasMorePosts,
        isFetchingNextPage: isFetchingMorePosts,
        isLoading: isLoadingPosts,
        isError: isPostsError,
        error: postsError,
    } = useInfiniteQuery({
        queryKey: ["bookmarkedPosts"],
        queryFn: fetchPosts,
        enabled: true,
        refetchOnMount: true,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
    });

    const {
        data: newsData,
        fetchNextPage: fetchNextNews,
        hasNextPage: hasMoreNews,
        isFetchingNextPage: isFetchingMoreNews,
        isLoading: isLoadingNews,
        isError: isNewsError,
        error: newsError,
    } = useInfiniteQuery({
        queryKey: ["bookmarkedNews"],
        queryFn: fetchNews,
        enabled: true,
        refetchOnMount: true,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
    });

    const {
        data: videosData,
        fetchNextPage: fetchNextVideos,
        hasNextPage: hasMoreVideos,
        isFetchingNextPage: isFetchingMoreVideos,
        isLoading: isLoadingVideos,
        isError: isVideosError,
        error: videosError,
    } = useInfiniteQuery({
        queryKey: ["bookmarkedVideos"],
        queryFn: fetchVideos,
        enabled: true,
        refetchOnMount: true,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
    });

    // Jobs infinite query - similar to layout.tsx
    const {
        data: jobsData,
        fetchNextPage: fetchNextJobs,
        hasNextPage: hasMoreJobs,
        isFetchingNextPage: isFetchingMoreJobs,
        isLoading: isLoadingJobs,
        isError: isJobsError,
        error: jobsError,
    } = useInfiniteQuery({
        queryKey: ['bookmarkedJobs'],
        queryFn: fetchJobs,
        enabled: true,
        refetchOnMount: true,
        getNextPageParam: (lastPage): string | undefined => {
            return lastPage.pagination?.hasMore ? lastPage.pagination.nextCursor : undefined;
        },
        initialPageParam: null,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Flatten the pages data for rendering
    const postBookmarks = postsData?.pages.flatMap((page) => page.data) || [];
    const newsBookmarks = newsData?.pages.flatMap((page) => page.data) || [];
    const videoBookmarks = videosData?.pages.flatMap((page) => page.data) || [];
    
    // Flatten jobs and filter for saved ones
    const allJobs = useMemo(() => {
        return jobsData?.pages.flatMap(page => page.data || []) || [];
    }, [jobsData]);

    const savedJobs = useMemo(() => {
        return allJobs.filter(job => job.isSaved);
    }, [allJobs]);

    // Handle tab change
    const handleTabChange = (category: string) => {
        setSelectedCategory(category);
        setPlayingVideoId(null);
    };

    // Adapter function for video card
    const adaptVideoForCard = useCallback((video: SDGVideoData) => {
        return {
            ...video,
            comments: Array.isArray(video.comments) ? video.comments.length : 0,
        };
    }, []);

    // Create invalidation functions instead of direct handlers
    const createPostInvalidationCallback = useCallback(
        (postId: string) => {
            return () => {
                queryClient.invalidateQueries({
                    queryKey: ["bookmarkedPosts"],
                });
            };
        },
        [queryClient]
    );

    const createVideoInvalidationCallback = useCallback(
        (videoId: string) => {
            return () => {
                queryClient.invalidateQueries({
                    queryKey: ["bookmarkedVideos"],
                });
            };
        },
        [queryClient]
    );

    // Job click handler
    const handleJobClick = useCallback((job: JobListing) => {
        setSelectedJob(job);
        // Determine if it's internship or job and navigate accordingly
        const isInternship = job.jobType === 'internship';
        router.push(`/${isInternship ? 'internship' : 'jobs'}/${job._id}`);
    }, [router]);

    // Use the specialized news bookmark hook
    const { toggleNewsBookmark } = useNewsBookmarkSync();

    // Updated handler for news unbookmark - uses the same mutation as TrendingNow
    const handleNewsUnbookmark = useCallback(
        (newsId: string) => {
            console.log(
                "Bookmarks page: Toggling bookmark for news ID:",
                newsId,
                "Current state: true"
            );

            // Explicitly call the mutation with the correct parameters
            toggleNewsBookmark.mutate({
                newsId: newsId,
                currentState: true, // News in bookmarks are always already bookmarked
            });
        },
        [toggleNewsBookmark]
    );

    // Helper rendering components
    const renderLoading = () => (
        <div className="flex justify-center items-center p-8">
            <Loader />
        </div>
    );

    const renderLoadingMore = () => (
        <div className="flex justify-center items-center p-4">
            <Loader />
        </div>
    );

    const renderError = (error: Error) => (
        <div className="flex justify-center items-center p-8 text-red-500">
            {error.message || "An error occurred. Please try again."}
        </div>
    );

    const renderEmpty = () => (
        <div className="flex justify-center items-center p-8 text-gray-500">
            No bookmarks found
        </div>
    );

    // Check if all data is loading for "All" tab
    const isAllLoading = isLoadingPosts || isLoadingNews || isLoadingVideos || isLoadingJobs;
    const isAllEmpty =
        !isAllLoading &&
        postBookmarks.length === 0 &&
        newsBookmarks.length === 0 &&
        videoBookmarks.length === 0 &&
        savedJobs.length === 0;
    const hasAnyError = isPostsError || isNewsError || isVideosError || isJobsError;

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <BackPageHeader headerTitle="Bookmarks" />

            <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
                {BOOKMARKS_TABS.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleTabChange(category)}
                        className={cn(
                            "md:px-8 px-3 py-1 rounded-full cursor-pointer md:text-lg font-semibold whitespace-nowrap",
                            selectedCategory === category
                                ? "bg-accent text-white"
                                : "bg-white text-accent border border-accent"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {hasAnyError && (
                <div className="p-4">
                    {isPostsError && renderError(postsError as Error)}
                    {isNewsError && renderError(newsError as Error)}
                    {isVideosError && renderError(videosError as Error)}
                    {isJobsError && renderError(jobsError as Error)}
                </div>
            )}

            {/* All Bookmarks Tab */}
            {selectedCategory === "All" && (
                <div className="flex flex-col gap-4 p-4">
                    {isAllLoading ? (
                        renderLoading()
                    ) : isAllEmpty ? (
                        renderEmpty()
                    ) : (
                        <>
                            {/* Post Bookmarks */}
                            {postBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold">
                                        Posts
                                    </h2>
                                    {postBookmarks.map((bookmark) => (
                                        <div key={bookmark._id}>
                                            <PostCard
                                                post={bookmark}
                                                onPostUpdate={createPostInvalidationCallback(
                                                    bookmark._id
                                                )}
                                            />
                                        </div>
                                    ))}
                                    {hasMorePosts && (
                                        <button
                                            onClick={() => fetchNextPosts()}
                                            className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                            disabled={isFetchingMorePosts}
                                        >
                                            {isFetchingMorePosts
                                                ? renderLoadingMore()
                                                : "Load more posts"}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* News Bookmarks */}
                            {newsBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold mt-4">
                                        News
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {newsBookmarks.map((news) => (
                                            <div
                                                key={news._id}
                                                className="border rounded-lg p-4 shadow-sm relative"
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleNewsUnbookmark(
                                                            news._id
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                                                    aria-label="Remove bookmark"
                                                >
                                                    <Bookmark className="h-5 w-5 fill-current text-accent" />
                                                </button>
                                                <h3 className="font-medium mb-2 pr-8">
                                                    {news.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {news.publisher}
                                                </p>
                                                <a
                                                    href={formatSDGLink(
                                                        news.link
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent text-sm hover:underline"
                                                >
                                                    Read article
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                    {hasMoreNews && (
                                        <button
                                            onClick={() => fetchNextNews()}
                                            className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                            disabled={isFetchingMoreNews}
                                        >
                                            {isFetchingMoreNews
                                                ? renderLoadingMore()
                                                : "Load more news"}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Video Bookmarks */}
                            {videoBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold mt-4">
                                        Videos
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {videoBookmarks.map((video) => (
                                            <div key={video._id}>
                                                <VideoCard
                                                    video={adaptVideoForCard(
                                                        video
                                                    )}
                                                    playingVideoId={
                                                        playingVideoId
                                                    }
                                                    setPlayingVideoId={
                                                        setPlayingVideoId
                                                    }
                                                    onBookmarkToggle={createVideoInvalidationCallback(
                                                        video._id
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {hasMoreVideos && (
                                        <button
                                            onClick={() => fetchNextVideos()}
                                            className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                            disabled={isFetchingMoreVideos}
                                        >
                                            {isFetchingMoreVideos
                                                ? renderLoadingMore()
                                                : "Load more videos"}
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Jobs Bookmarks */}
                            {savedJobs.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold mt-4">
                                        Jobs
                                    </h2>
                                    <div className="space-y-2">
                                        {savedJobs.map((job) => (
                                            <JobCard
                                                key={job._id}
                                                job={job}
                                                isSelected={selectedJob?._id === job._id}
                                                onClick={() => handleJobClick(job)}
                                            />
                                        ))}
                                    </div>
                                    {savedJobs.length > 30 && hasMoreJobs && (
                                        <button
                                            onClick={() => fetchNextJobs()}
                                            className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                            disabled={isFetchingMoreJobs}
                                        >
                                            {isFetchingMoreJobs
                                                ? renderLoadingMore()
                                                : "Load more jobs"}
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Posts Tab */}
            {selectedCategory === "Posts" && (
                <div className="flex flex-col gap-4 p-4">
                    {isLoadingPosts ? (
                        renderLoading()
                    ) : postBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            {postBookmarks.map((bookmark) => (
                                <div key={bookmark._id}>
                                    <PostCard
                                        post={bookmark}
                                        onPostUpdate={createPostInvalidationCallback(
                                            bookmark._id
                                        )}
                                    />
                                </div>
                            ))}
                            {hasMorePosts && (
                                <button
                                    onClick={() => fetchNextPosts()}
                                    className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                    disabled={isFetchingMorePosts}
                                >
                                    {isFetchingMorePosts
                                        ? renderLoadingMore()
                                        : "Load more posts"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* News Tab */}
            {selectedCategory === "News" && (
                <div className="flex flex-col gap-4 p-4">
                    {isLoadingNews ? (
                        renderLoading()
                    ) : newsBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {newsBookmarks.map((news) => (
                                    <div
                                        key={news._id}
                                        className="border rounded-lg p-4 shadow-sm relative"
                                    >
                                        <button
                                            onClick={() =>
                                                handleNewsUnbookmark(news._id)
                                            }
                                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                                            aria-label="Remove bookmark"
                                        >
                                            <Bookmark className="h-5 w-5 fill-current text-accent" />
                                        </button>
                                        <h3 className="font-medium mb-2 pr-8">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {news.publisher}
                                        </p>
                                        <a
                                            href={formatSDGLink(news.link)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent text-sm hover:underline"
                                        >
                                            Read article
                                        </a>
                                    </div>
                                ))}
                            </div>
                            {hasMoreNews && (
                                <button
                                    onClick={() => fetchNextNews()}
                                    className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                    disabled={isFetchingMoreNews}
                                >
                                    {isFetchingMoreNews
                                        ? renderLoadingMore()
                                        : "Load more news"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Videos Tab */}
            {selectedCategory === "Videos" && (
                <div className="flex flex-col gap-4 p-4">
                    {isLoadingVideos ? (
                        renderLoading()
                    ) : videoBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {videoBookmarks.map((video) => (
                                    <div key={video._id}>
                                        <VideoCard
                                            video={adaptVideoForCard(video)}
                                            playingVideoId={playingVideoId}
                                            setPlayingVideoId={
                                                setPlayingVideoId
                                            }
                                            onBookmarkToggle={createVideoInvalidationCallback(
                                                video._id
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            {hasMoreVideos && (
                                <button
                                    onClick={() => fetchNextVideos()}
                                    className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                    disabled={isFetchingMoreVideos}
                                >
                                    {isFetchingMoreVideos
                                        ? renderLoadingMore()
                                        : "Load more videos"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Jobs Tab */}
            {selectedCategory === "Jobs" && (
                <div className="flex flex-col gap-4 p-4">
                    {isLoadingJobs ? (
                        renderLoading()
                    ) : savedJobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No saved jobs found</p>
                            <p className="text-sm">
                                You haven't saved any jobs yet
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                {savedJobs.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        job={job}
                                        isSelected={selectedJob?._id === job._id}
                                        onClick={() => handleJobClick(job)}
                                    />
                                ))}
                            </div>
                            {hasMoreJobs && (
                                <button
                                    onClick={() => fetchNextJobs()}
                                    className="w-full py-2 text-accent hover:bg-gray-50 rounded-md"
                                    disabled={isFetchingMoreJobs}
                                >
                                    {isFetchingMoreJobs
                                        ? renderLoadingMore()
                                        : "Load more jobs"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookmarksPage;
