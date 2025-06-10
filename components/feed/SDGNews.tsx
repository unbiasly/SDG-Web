import { SDG_NEWS } from "@/lib/constants/index-constants";
import { formatDate } from "@/lib/utilities/formatDate";
import { formatSDGLink } from "@/lib/utilities/sdgLinkFormat";
import { Bookmark, Flag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@/lib/redux/features/user/hooks";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import ReportPopover from "../post/ReportPopover";

export interface Article {
    _id: string;
    title: string;
    publisher: string;
    link: string;
    isBookmarked?: boolean;
    createdAt: string;
    updatedAt: string;
}

// API Response interface
interface SDGNewsResponse {
    success: boolean;
    data: Article[];
    pagination: {
        limit: string;
        cursor: string | null;
        nextCursor: string | null;
        hasMore: boolean;
        totalItems: number;
    };
}

// Update ArticleCard component to add working bookmark functionality

export const ArticleCard = ({
    article,
    onBookmarkToggle,
}: {
    article: Article;
    onBookmarkToggle?: () => void;
}) => {
    const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const handleBookmarkToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            // Optimistic update
            setIsBookmarked(!isBookmarked);

            const response = await fetch("/api/sdgNews", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newsId: article._id,
                    actionType: "bookmark",
                }),
            });

            if (!response.ok) {
                // Revert if failed
                setIsBookmarked(isBookmarked);
                throw new Error("Failed to update bookmark status");
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["sdgNews"],
                exact: false,
            });

            // If we're in bookmarks view and unbookmarking, trigger removal
            if (isBookmarked && onBookmarkToggle) {
                onBookmarkToggle();
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            // Revert optimistic update on error
            setIsBookmarked(isBookmarked);
        }
    };

    return (
        <Link
            href={formatSDGLink(article.link)}
            target="_blank"
            className="rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md mb-4 flex flex-col sm:flex-row"
        >
            <div className="w-full border rounded-2xl p-4 flex flex-col justify-between">
                <div>
                    <h2 className="font-bold text-base mb-2">
                        {article.title}
                    </h2>
                    <div className="flex items-center mb-2 font-semibold text-xs text-gray-500">
                        <span>{article.publisher}</span>
                        <span className="mx-3">•</span>
                        <span>{formatDate(article.updatedAt)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        aria-label="bookmark"
                        onClick={handleBookmarkToggle}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Bookmark
                            size={20}
                            className={`${
                                isBookmarked
                                    ? "fill-current text-accent"
                                    : "text-gray-500"
                            }`}
                        />
                    </button>
                    
                    <button 
                        aria-label="Report" 
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Flag size={20} className="h-5 w-5" />  
                    </button>
                </div>
            </div>
            <ReportPopover
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen} 
                id={article._id}
                type="sdgNews"
            />
        </Link>
    );
};

const SDGNews = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { user } = useUser();
    const { ref, inView } = useInView();

    // Fetch function for infinite query
    const fetchSDGNews = async ({ pageParam }: { pageParam: string | null }): Promise<SDGNewsResponse> => {
        const response = await fetch("/api/sdgNews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: user?._id,
                cursor: pageParam,
                limit: 20, // Adjust limit as needed
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch SDG news');
        }

        return response.json();
    };

    // Infinite query setup
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["sdgNews"],
        queryFn: fetchSDGNews,
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasMore 
                ? lastPage.pagination.nextCursor 
                : undefined,
        initialPageParam: null,
        enabled: isMobile && !!user?._id, // Only fetch on mobile when user is available
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    // Auto-fetch next page when in view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Flatten all articles from all pages
    const articles = useMemo(
        () => data?.pages.flatMap((page) => page.data) || [],
        [data?.pages]
    );

    // Loading state
    if (status === "pending") {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mb-10">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                        {[1, 2].map((j) => (
                            <div
                                key={j}
                                className="flex mb-4 bg-gray-100 rounded-2xl h-40"
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (status === "error") {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    <p>Error loading SDG news</p>
                    <p className="text-sm text-gray-500 mt-2">{error?.message}</p>
                </div>
            </div>
        );
    }

    // Don't render on desktop
    if (!isMobile) {
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {SDG_NEWS.map((section) => (
                <NewsSection
                    key={section.id}
                    title={section.title}
                    articleIds={articles.map((a) => a._id)}
                    allArticles={articles}
                />
            ))}

            {/* Loading indicator for infinite scroll */}
            {hasNextPage && (
                <div
                    ref={ref}
                    className="flex justify-center py-8"
                >
                    {isFetchingNextPage ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-500">Loading more news...</span>
                        </div>
                    ) : (
                        <div className="h-8"></div> // Trigger area for intersection observer
                    )}
                </div>
            )}

            {/* End of content message */}
            {!hasNextPage && articles.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>You've reached the end of SDG news</p>
                </div>
            )}

            {/* Empty state */}
            {articles.length === 0 && !isFetchingNextPage && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No SDG news available</p>
                </div>
            )}
        </div>
    );
};

const NewsSection = ({
    title,
    articleIds,
    allArticles,
}: {
    title: string;
    articleIds: string[];
    allArticles: Article[];
}) => {
    const sectionArticles = allArticles.filter((article) =>
        articleIds.includes(article._id)
    );

    if (sectionArticles.length === 0) {
        return null;
    }

    return (
        <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <div className="space-y-4">
                {sectionArticles.map((article, index) => (
                    <ArticleCard
                        key={`${article._id}-${index}`}
                        article={article}
                    />
                ))}
            </div>
        </section>
    );
};

export default SDGNews;
