import React, { useState, useEffect, useRef } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { cn } from "@/lib/utils";
import { CommentData } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import { Loader2, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

// New interface for pagination response
interface PaginationResponse {
    limit: string;
    cursor: string | null;
    nextCursor: string | null;
    hasMore: boolean;
}

// New interface for comments response
interface CommentsResponse {
    data: CommentData[];
    pagination: PaginationResponse;
}

interface CommentSectionProps {
    post_id: string;
    isOpen: boolean;
    commentCount?: number;
    comments: CommentData[];
    className?: string;
    onCommentAdded?: () => void;
}

interface CommentProps {
    _id: string;
    userName: string;
    content: string;
    userAvatar: string;
    className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
    post_id,
    isOpen,
    comments: initialComments,
    className,
    onCommentAdded,
}) => {
    const [comment, setComment] = useState<string>("");
    const { user } = useUser();
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();

    // Set up the fetch function for comments
    const fetchComments = async ({
        pageParam,
    }: {
        pageParam: string | null;
    }) => {
        const response = await fetch(`/api/post/post-action`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                actionType: "comment",
                postId: post_id,
                cursor: pageParam,
                limit: 30,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        return response.json() as Promise<CommentsResponse>;
    };

    // Set up the infinite query
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["comments", post_id],
        queryFn: fetchComments,
        getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
        initialPageParam: null,
        enabled: isOpen, // Only fetch when comment section is open
    });

    // Monitor when the sentinel element comes into view to load more comments
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all comments from all pages
    const allComments =
        data?.pages.flatMap((page) => page.data) || initialComments || [];

    // Handle adding a new comment
    const handleComment = async () => {
        if (!comment.trim()) return;

        try {
            // Clear input right away for better user experience
            setComment("");

            // Send API request
            const response = await fetch(`/api/post/post-action/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: post_id,
                    actionType: "comment",
                    comment: comment,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to comment");
            }

            // Invalidate the comments query to refresh data
            queryClient.invalidateQueries({ queryKey: ["comments", post_id] });

            // Notify parent component about the new comment
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error("Error commenting post:", error);
            // Remove optimistic update on error
            queryClient.invalidateQueries({ queryKey: ["comments", post_id] });
        }
    };

    // Don't render anything if the comment section is closed
    if (!isOpen) return null;

    return (
        <div className={cn("border-t border-gray-200 pt-3", className)}>
            {/* Comment input area */}
            <div className="flex gap-3 mb-4">
                <ProfileAvatar src={user?.profileImage || ""} size="xs" />
                <div className="flex-1 flex items-center relative">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && comment.trim()) {
                                handleComment();
                            }
                        }}
                    />
                    <SendHorizonal
                        className="ml-2 cursor-pointer"
                        onClick={handleComment}
                    />
                </div>
            </div>

            {/* Comments header */}
            <div className="flex items-center mt-5">
                <h1>Comments</h1>
            </div>

            {/* Comments list with loading states */}
            {isLoading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
            ) : isError ? (
                <div className="text-red-500 p-4 text-center">
                    {error instanceof Error
                        ? error.message
                        : "Failed to load comments"}
                </div>
            ) : allComments.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                    <div className="space-y-1 pr-4">
                        {allComments.map((comment) => (
                            <Comment
                                key={comment._id}
                                _id={comment.user_id._id}
                                userName={comment.user_id.username}
                                content={comment.comment}
                                userAvatar={comment.user_id.profileImage || ""}
                            />
                        ))}
                        {/* Invisible element to trigger loading more comments */}
                        <div
                            ref={ref}
                            className="h-4 w-full"
                            aria-hidden="true"
                        >
                            {isFetchingNextPage && (
                                <div className="flex justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 items-center text-sm p-4 text-center">
                    No comments available. Be the first to comment!
                </p>
            )}
        </div>
    );
};

// Comment component remains unchanged
const Comment: React.FC<CommentProps> = ({
    _id,
    userName,
    content,
    userAvatar,
    className,
}) => {
    return (
        <div className={cn("flex gap-3 py-4", className)}>
            
            <ProfileAvatar src={userAvatar} size="xs" />

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <Link
                        href={`/profile/${_id}`}
                        className="font-bold text-sm"
                    >
                        <span className="hover:underline">{userName}</span>
                    </Link>
                </div>

                <p className="mt-1 text-sm">{content}</p>
            </div>
        </div>
    );
};

export default CommentSection;
