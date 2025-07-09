"use client";
import { formatDate } from "@/lib/utilities/formatDate";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Article } from "./SDGNews";
import { formatSDGLink } from "@/lib/utilities/sdgLinkFormat";
import {
    Bookmark,
    Flag,
    MoreVertical,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import { useUser } from "@/lib/redux/features/user/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Add this import
import { toast } from "react-hot-toast"; // Add toast for feedback
import { useNewsBookmarkSync } from "@/hooks/useNewsBookmarkSync";

interface TrendingItemProps {
    _id: string;
    title: string;
    publisher: string;
    link: string;
    updatedAt: string;
    isBookmarked?: boolean;
}

const TrendingItem: React.FC<TrendingItemProps> = ({
    _id,
    title,
    publisher,
    link,
    isBookmarked,
}) => {
    // Use the specialized news bookmark hook
    const { toggleNewsBookmark } = useNewsBookmarkSync();

    const handleBookmark = () => {
        console.log(
            "TrendingNow: Toggling bookmark for news ID:",
            _id,
            "Current state:",
            isBookmarked
        );

        // Explicitly call the mutation with the correct parameters
        toggleNewsBookmark.mutate({
            newsId: _id,
            currentState: isBookmarked,
        });
    };

    return (
        <div className="rounded-sm mb-2 shadow-sm border p-2">
            <Link key={_id} href={link} target="_blank" className="mb-2">
                <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
                <span className="text-xs text-gray-500">{publisher}</span>
            </Link>
            <div
                className="flex justify-between items-center mt-2"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    aria-label={isBookmarked ? "remove bookmark" : "bookmark"}
                    className="rounded-full hover:bg-gray-200 cursor-pointer p-1"
                    onClick={handleBookmark}
                    disabled={toggleNewsBookmark.isPending}
                >
                    <Bookmark
                        size={15}
                        className={`${
                            isBookmarked
                                ? "fill-current text-accent"
                                : "text-gray-500"
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

export const TrendingSection: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useUser();
    const queryClient = useQueryClient();

    // Use React Query to fetch news data
    const { data: newsData, error } = useQuery({
        queryKey: ["sdgNews", user?._id],
        queryFn: async () => {
            const response = await fetch("/api/sdgNews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user?._id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch SDG news");
            }

            return response.json();
        },
        enabled: !!user?._id, // Only run when user ID is available
        staleTime: 5 * 60 * 1000, // 5 minutes before refetching
        refetchOnWindowFocus: false,
    });

    // Extract articles from the query response
    const articles = newsData?.data || [];

    // Set loading state based on query status
    useEffect(() => {
        setIsLoading(!newsData && !error);
    }, [newsData, error]);

    if (isLoading) {
        return (
            <div className="bg-white p-3 rounded-2xl border border-gray-300 flex flex-col h-full">
                <div className="h-6 w-32 bg-gray-200 rounded-2xl mb-1 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>

                <div className="space-y-4 flex-1 overflow-hidden">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="rounded-2xl p-1">
                            <div className="h-10 bg-gray-200 rounded-2xl mb-1 animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded-2xl animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-3 rounded-2xl border border-gray-300 flex flex-col h-full">
                <h3 className="text-xl text-accent font-semibold mb-1">
                    SDG News
                </h3>
                <p className="text-sm text-red-500 mb-4">Failed to load news</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-3 rounded-2xl border border-gray-300 animate-fade-in flex flex-col max-h-full">
            <div className="flex-shrink-0 flex flex-col space-y-1 mb-2">
                <h3 className="text-xl text-accent font-semibold">SDG News</h3>
                <p className="text-sm text-gray-500">@TheSDG story</p>
            </div>

            <div className="flex-1 overflow-y-auto hidden-scrollbar min-h-0">
                {articles.map((article: any) => (
                    <TrendingItem
                        key={article._id}
                        _id={article._id}
                        title={article.title}
                        publisher={article.publisher}
                        link={formatSDGLink(article.link)}
                        updatedAt={article.updatedAt}
                        isBookmarked={article.isBookmarked}
                    />
                ))}
            </div>
        </div>
    );
};
