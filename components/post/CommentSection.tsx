import React, { useState, useEffect } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { cn } from "@/lib/utils";
import { CommentData } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import { Loader2, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { AppApi } from "@/service/app.api";
import { toast } from "react-hot-toast";

// Interfaces remain the same
interface PaginationResponse {
    limit: string;
    cursor: string | null;
    nextCursor: string | null;
    hasMore: boolean;
}

interface CommentsResponse {
    data: CommentData[];
    pagination: PaginationResponse;
}

interface CommentSectionProps {
    post_id: string;
    isOpen: boolean;
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
    className,
    onCommentAdded,
}) => {
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();

    // Fixed fetch function for comments
    const fetchComments = async ({
        pageParam,
    }: {
        pageParam: string | null;
    }): Promise<CommentsResponse> => {
        const response = await AppApi.fetchComments(
            post_id,
            pageParam,
            30
        );

        if (!response.success) {
            throw new Error(response.error || "Failed to fetch comments");
        }

        return response.data as CommentsResponse;
    };

    // Set up the infinite query - only fetch when open
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["comments", post_id],
        queryFn: fetchComments,
        getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor || null,
        initialPageParam: null,
        enabled: isOpen, // Only fetch when comment section is open
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });

    // Monitor when the sentinel element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Flatten all comments from all pages
    const allComments = data?.pages.flatMap((page) => page.data) || [];

    // Handle adding a new comment
    const handleComment = async () => {
        if (!comment.trim() || isSubmitting) return;

        const commentText = comment.trim();
        setIsSubmitting(true);

        try {
            // Clear input immediately for better UX
            setComment("");

            // Send API request to post comment
            const response = await AppApi.postAction(
                post_id,
                "comment",
                "PATCH", // Use PATCH for posting new comments
                commentText
            );

            if (!response.success) {
                throw new Error(response.error || "Failed to post comment");
            }
            

            // Notify parent component
            if (onCommentAdded) {
                onCommentAdded();
            }

            queryClient.invalidateQueries({ 
                queryKey: ["comments", post_id],
                exact: true 
            });

            toast.success("Comment added successfully!");

        } catch (error) {
            console.error("Error commenting post:", error);
            
            // Restore the comment text on error
            setComment(commentText);
            
            // Invalidate to remove optimistic update
            queryClient.invalidateQueries({ 
                queryKey: ["comments", post_id],
                exact: true 
            });
            
            toast.error("Failed to add comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render anything if the comment section is closed
    if (!isOpen) return null;

    return (
        <div className={cn("border-t border-gray-200 pt-3", className)}>
            {/* Comment input area */}
            <div className="flex gap-3 mb-4">
                <ProfileAvatar 
                    src={user?.profileImage || ""} 
                    size="xs" 
                    userName={user?.name || user?.username} 
                />
                <div className="flex-1 flex items-center relative">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                        disabled={isSubmitting}
                        className="w-full p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && comment.trim() && !isSubmitting) {
                                handleComment();
                            }
                        }}
                    />
                    {isSubmitting ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin text-gray-400" />
                    ) : (
                        <SendHorizonal
                            className={`ml-2 h-4 w-4 cursor-pointer transition-colors ${
                                comment.trim() 
                                    ? "text-accent hover:text-accent/80" 
                                    : "text-gray-400"
                            }`}
                            onClick={handleComment}
                        />
                    )}
                </div>
            </div>

            {/* Comments header */}
            <div className="flex items-center justify-between mt-5 mb-3">
                <h1 className="font-medium">Comments</h1>
                {allComments.length > 0 && (
                    <span className="text-sm text-gray-500">
                        {allComments.length} comment{allComments.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Comments list with loading and error states */}
            {isLoading ? (
                <div className="flex justify-center p-8">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Loading comments...</span>
                    </div>
                </div>
            ) : isError ? (
                <div className="text-center p-8">
                    <div className="text-red-500 mb-2">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load comments"}
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="text-sm text-accent hover:underline"
                    >
                        Try again
                    </button>
                </div>
            ) : allComments.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                    <div className="space-y-1 pr-2">
                        {allComments.map((commentData) => (
                            <Comment
                                key={commentData._id}
                                _id={commentData.user_id._id}
                                userName={commentData.user_id.username}
                                content={commentData.comment}
                                userAvatar={commentData.user_id.profileImage || ""}
                            />
                        ))}
                        
                        {/* Load more trigger */}
                        {hasNextPage && (
                            <div
                                ref={ref}
                                className="flex justify-center py-4"
                            >
                                {isFetchingNextPage ? (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Loading more...</span>
                                    </div>
                                ) : (
                                    <div className="h-4 w-full" />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center p-8">
                    <p className="text-gray-500 text-sm">
                        No comments yet. Be the first to comment!
                    </p>
                </div>
            )}
        </div>
    );
};

// Comment component - enhanced with better styling
const Comment: React.FC<CommentProps> = ({
    _id,
    userName,
    content,
    userAvatar,
    className,
}) => {
    return (
        <div className={cn("flex gap-3 py-3 border-b border-gray-50 last:border-b-0", className)}>
            <ProfileAvatar src={userAvatar} size="xs" userName={userName} />
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <Link
                        href={`/profile/${_id}`}
                        className="font-medium text-sm text-gray-900 hover:text-accent transition-colors"
                    >
                        {userName}
                    </Link>
                </div>
                <p className="text-sm text-gray-700 break-words">{content}</p>
            </div>
        </div>
    );
};

export default CommentSection;
