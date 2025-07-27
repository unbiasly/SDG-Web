"use client";

import { useUser } from "@/lib/redux/features/user/hooks";
import { SDGVideoDetails } from "@/service/api.interface";
import React, { useEffect, useState, use } from "react";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import {
    ArrowLeft,
    Bookmark,
    MoreHorizontal,
    PlayCircle,
    Share2,
    ThumbsUp,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { da } from "date-fns/locale";
import Link from "next/link";
import ShareContent from "@/components/post/ShareContent";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQueryClient } from "@tanstack/react-query";

type Params = Promise<{ id: string }>;

export default function Page({ params }: { params: Params }) {
    const { id } = use(params);
    const { user } = useUser();
    const [data, setData] = useState<SDGVideoDetails | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(data?.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked);
    const [likesCount, setLikesCount] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [shareOpen, setShareOpen] = useState(false);
    const [commentSubmitted, setCommentSubmitted] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Detect mobile for better touch handling
    const isMobile = useMediaQuery("(max-width: 768px)");

    const queryClient = useQueryClient();

    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 1,
            // Add mobile-specific parameters
            ...(isMobile && {
                playsinline: 1,
                controls: 1,
                disablekb: 1, // Disable keyboard controls on mobile
                fs: 1,
                rel: 0,
            }),
        },
    };

    const fetchVideoById = async (showLoading = true) => {
        try {
            // Only show loading state if requested and not mounted yet
            if (showLoading && !mounted) {
                setIsLoading(true);
            }
            const response = await fetch("/api/video/single", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    userId: user?._id,
                    videoId: id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch videos");
            }

            const result = await response.json();
            setData(result.data);
            setIsLiked(result.data?.isLiked || false);
            setIsBookmarked(result.data?.isBookmarked || false);
            setLikesCount(result.data?.likes || 0);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            // Only update loading state if requested and not mounted yet
            if (showLoading && !mounted) {
                setIsLoading(false);
            }
        }
    };

    const handleBookmarkToggle = async () => {
        try {
            const response = await fetch(`/api/video`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoId: id,
                    actionType: "bookmark",
                }),
            });

            if (response.ok) {
                setIsBookmarked((prevState) => !prevState);
                queryClient.invalidateQueries({
                    queryKey: ["bookmarkedVideos"],
                });
                setData((prevData) =>
                    prevData
                        ? {
                              ...prevData,
                              isBookmarked: !prevData.isBookmarked,
                          }
                        : null
                );
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
    };

    const handleLikeToggle = async () => {
        try {
            const response = await fetch(`/api/video`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoId: id,
                    actionType: "like",
                }),
            });

            if (response.ok) {
                setIsLiked((prevState) => !prevState);
                setLikesCount((prevCount) =>
                    isLiked ? prevCount - 1 : prevCount + 1
                );
                setData((prevData) => {
                    if (!prevData) return null;
                    return {
                        ...prevData,
                        isLiked: !prevData.isLiked,
                        likes: prevData.isLiked
                            ? (prevData.likes || 1) - 1
                            : (prevData.likes || 0) + 1,
                    };
                });
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);

        try {
            const response = await fetch(`/api/video`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoId: id,
                    actionType: "comment",
                    comment: commentText,
                }),
            });

            if (response.ok) {
                setCommentText("");
                setCommentSubmitted((prev) => !prev);

                // Fetch updated data without showing loading
                await fetchVideoById(false);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleCommentKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !isSubmittingComment) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };

    const handleVideoClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(false);
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    const handleShareClick = () => {
        setShareOpen(true);
    };

    const [error, setError] = useState<string | null>(null);
    // At top of your component, add an error state

    useEffect(() => {
        try {
            if (id) {
                fetchVideoById();
            }
        } catch (error) {
            console.error("Error fetching video by ID:", error);
            setError("Failed to load video. Please try again.");
            setIsLoading(false);
        } finally {
            setMounted(true);
        }
    }, [id, user?._id]);

    // Before your loading/UI logic, handle the error
    if (error) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="animate-pulse text-xl">
                    Loading video content...
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-h-screen hidden-scrollbar">
            {/* Fixed Header */}
            <div className="bg-white border-b border-gray-200 relative z-10">
                <div className="flex items-center p-2 sm:p-3 max-w-3xl mx-auto">
                    <Link
                        href="/videos"
                        aria-label="back-button"
                        className="mr-2 sm:mr-4 p-1 sm:p-0 touch-manipulation"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </Link>
                    <h1 className="text-base sm:text-lg font-semibold flex-1">
                        Video
                    </h1>
                </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-col w-full max-w-3xl mx-auto px-2 sm:px-4 py-3 lg:py-6 md:px-0 flex gap-2 sm:gap-4">
                {/* Video Player */}
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-2 sm:mb-4 touch-manipulation">
                    {isPlaying ? (
                        <div className="relative w-full h-full aspect-video overflow-hidden">
                            <YouTube
                                videoId={data?.video_id}
                                opts={opts}
                                className="w-full h-full"
                                onEnd={() => setIsPlaying(false)}
                                onStateChange={(event) => {
                                    // Handle state changes for mobile
                                    if (isMobile && event.data === 1) {
                                        // Video is playing - allow normal touch behavior
                                        document.body.classList.add('touch-auto');
                                    }
                                }}
                            />
                            <button
                                onClick={handleVideoClose}
                                className="absolute cursor-pointer top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10 touch-manipulation"
                                aria-label="Close video"
                            >
                                <X
                                    className="h-4 w-4 sm:h-5 sm:w-5"
                                    color="white"
                                />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="relative cursor-pointer w-full h-full overflow-hidden aspect-video flex items-center justify-center touch-manipulation"
                            onClick={handlePlayClick}
                        >
                            <img
                                src={data?.thumbnail_url}
                                alt={data?.title}
                                className="w-full touch-manipulation"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                <PlayCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-2 sm:gap-4 pb-safe">
                    {/* Video Info */}
                    <div className="flex flex-col gap-3 sm:gap-5">
                        <div className="flex flex-col justify-between">
                            <div className="flex items-start sm:items-center gap-2 sm:gap-4">
                                <Image
                                    src={"/placeholder.png"}
                                    alt={data?.title || ""}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    objectFit="cover"
                                    className="rounded-full w-14 h-14 sm:w-20 sm:h-20"
                                />
                                <div className="flex flex-col h-14 sm:h-20 w-1 sm:w-2">
                                    <div className="flex-1 bg-[#E5243B]" />
                                    <div className="flex-1 bg-[#DDA63A]" />
                                    <div className="flex-1 bg-[#4C9F38]" />
                                    <div className="flex-1 bg-[#C5192D]" />
                                    <div className="flex-1 bg-[#FF3A21]" />
                                    <div className="flex-1 bg-[#26BDE2]" />
                                    <div className="flex-1 bg-[#FCC30B]" />
                                    <div className="flex-1 bg-[#A21942]" />
                                    <div className="flex-1 bg-[#FD6925]" />
                                    <div className="flex-1 bg-[#DD1367]" />
                                    <div className="flex-1 bg-[#FD9D24]" />
                                    <div className="flex-1 bg-[#BF8B2E]" />
                                    <div className="flex-1 bg-[#3F7E44]" />
                                    <div className="flex-1 bg-[#0A97D9]" />
                                    <div className="flex-1 bg-[#56C02B]" />
                                    <div className="flex-1 bg-[#00689D]" />
                                    <div className="flex-1 bg-[#19486A]" />
                                </div>
                                <h2 className="text-lg sm:text-2xl font-semibold">
                                    {data?.title || "Video Title"}
                                </h2>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <span className="text-sm sm:text-md text-gray-600">
                                    {data?.views} views
                                </span>
                                <span className="text-sm sm:text-md text-gray-600">
                                    {data?.published_date
                                        ? `${Math.floor(
                                              (Date.now() -
                                                  new Date(
                                                      data.published_date
                                                  ).getTime()) /
                                                  (1000 * 60 * 60 * 24)
                                          )} days ago`
                                        : ""}
                                </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-start gap-1 sm:gap-4">
                                {[
                                    {
                                        icon: (
                                            <ThumbsUp
                                                className={cn(
                                                    "w-4 h-4 sm:w-5 sm:h-5",
                                                    isLiked
                                                        ? "fill-current text-blue-500"
                                                        : "text-gray-400"
                                                )}
                                            />
                                        ),
                                        text: likesCount.toString(),
                                        onClick: handleLikeToggle,
                                    },
                                    {
                                        icon: (
                                            <Bookmark
                                                className={cn(
                                                    "w-4 h-4 sm:w-5 sm:h-5",
                                                    isBookmarked
                                                        ? "fill-current text-blue-500"
                                                        : "fill-none"
                                                )}
                                            />
                                        ),
                                        text: isBookmarked ? "Saved" : "Save",
                                        onClick: handleBookmarkToggle,
                                    },
                                    {
                                        icon: (
                                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        ),
                                        text: "Share",
                                        onClick: handleShareClick,
                                    },
                                ].map((item, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="flex items-center p-0 gap-2 touch-manipulation"
                                        onClick={item.onClick}
                                    >
                                        {item.icon}
                                        <span className="text-lg font-semibold">
                                            {item.text}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-2 border rounded-lg border-gray-400">
                        <p className="text-base sm:text-lg text-gray-700 mb-8">
                            {data?.description || "No description available"}
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="mb-2 py-2 px-4 border rounded-lg border-gray-400">
                        <h3 className="text-lg font-semibold mb-4">Comments</h3>

                        {/* Add Comment Input */}
                        <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <ProfileAvatar
                                src={user?.profileImage || ""}
                                userName={user?.name || user?.username}
                                size="xs"
                            />
                            <div className="flex-1 flex flex-row sm:items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Leave a comment..."
                                    className={cn(
                                        "flex-1 w-full bg-transparent border p-2 px-3 border-gray-300 focus:outline-none focus:border-accent rounded-full text-sm sm:text-base touch-manipulation",
                                        isMobile && "text-base"
                                    )}
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    onKeyPress={handleCommentKeyPress}
                                    disabled={isSubmittingComment}
                                />
                                <Button
                                    className="ml-auto sm:ml-2 text-sm sm:text-base py-2 px-3 sm:px-4 hover:bg-accent rounded-full touch-manipulation"
                                    onClick={handleCommentSubmit}
                                    disabled={
                                        !commentText.trim() ||
                                        isSubmittingComment
                                    }
                                >
                                    {isSubmittingComment
                                        ? "Posting..."
                                        : "Post"}
                                </Button>
                            </div>
                        </div>

                        {/* Comments */}
                        <div className="max-h-[200px] overflow-y-auto">
                            {data?.comments?.length ? (
                                data.comments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 mb-4"
                                    >
                                        <ProfileAvatar
                                            src={
                                                comment?.user_id
                                                    ?.profileImage || ""
                                            }
                                            userName={
                                                comment?.user_id?.name ||
                                                comment?.user_id?.username
                                            }
                                            size="xs"
                                        />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/profile/${comment?.user_id?._id}`}
                                                    className="font-bold text-sm touch-manipulation"
                                                >
                                                    <span className="font-semibold hover:underline">
                                                        {comment?.user_id
                                                            ?.name ||
                                                            `@${comment?.user_id?.username}`}
                                                    </span>
                                                </Link>
                                            </div>
                                            <p className="text-gray-700">
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    No comments yet. Be the first to comment!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ShareContent
                open={shareOpen}
                onOpenChange={setShareOpen}
                contentUrl={`/videos/${id}`}
                itemId={id}
            />
        </div>
    );
}
