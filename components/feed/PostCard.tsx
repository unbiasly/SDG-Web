"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    ThumbsUp,
    MessageCircle,
    Bookmark,
    Flag,
    MoreVertical,
    Pencil,
    Trash,
    UserPlus,
    Repeat,
    Send,
    X,
} from "lucide-react";
import Image from "next/image";
import CommentSection from "../post/CommentSection";
import { CommentData, Post } from "@/service/api.interface";
import ProfileAvatar from "../profile/ProfileAvatar";
import ReportPopover from "../post/ReportPopover";
import EditPost from "../post/EditPost";
import { useUser } from "@/lib/redux/features/user/hooks";
import { BentoImageGrid } from "../post/BentoGrid";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "../custom-ui/ConfirmationDialog";
import ShareContent from "../post/ShareContent";
import { useQueryClient } from "@tanstack/react-query";
import Options from "../custom-ui/Options";
import { formatDate } from "@/lib/utilities/formatDate";
import { AppApi } from "@/service/app.api";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import ImageCarousel from "../post/ImageCarousel";
import ColoredDivider from "./ColoredDivider";

interface PostCardProps {
    isCommentOpen?: boolean;
    post?: Post;
    onPostUpdate?: () => void;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({
    post,
    isCommentOpen = false,
    onPostUpdate,
}) => {
    // State management
    const [isCommentsOpen, setIsCommentsOpen] = useState(isCommentOpen);
    const [localCommentsCount, setLocalCommentsCount] = useState(post?.poststat_id?.comments || 0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [localLikesCount, setLocalLikesCount] = useState(post?.poststat_id?.likes || 0);
    const [isLocalLiked, setIsLocalLiked] = useState(post?.isLiked);
    const [localRepostsCount, setLocalRepostsCount] = useState(post?.poststat_id?.reposts || 0);
    const [isBookmarkActive, setIsBookmarkActive] = useState(post?.isBookmarked);
    const [isFollowedActive, setIsFollowedActive] = useState(post?.user_id?.isFollowing);
    
    // Modal states
    const [reportOpen, setReportOpen] = useState(false);
    const [editPostOpen, setEditPostOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [repostConfirmOpen, setRepostConfirmOpen] = useState(false);
    const [shareContentOpen, setShareContentOpen] = useState(false);

    // Loading states
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isRepostLoading, setIsRepostLoading] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const { user } = useUser();
    const queryClient = useQueryClient();

    // Memoized values
    const currentUserId = useMemo(() => user?._id, [user?._id]);
    const isOwnPost = useMemo(() => post?.user_id?._id === currentUserId, [post?.user_id?._id, currentUserId]);
    const postImages = useMemo(() => 
        post?.images ? (Array.isArray(post?.images) ? post?.images : [post?.images]) : [], 
        [post?.images]);

    useEffect(() => {
        if (!post?.images || !post?.images.length || post?.images.length === 0) {
            setIsDialogOpen(false);
        } 
    }, [post?.images]);

    // Sync state with props changes
    useEffect(() => {
        setIsLocalLiked(post?.isLiked);
        setLocalLikesCount(post?.poststat_id?.likes || 0);
        setIsBookmarkActive(post?.isBookmarked);
        setLocalRepostsCount(post?.poststat_id?.reposts || 0);
        setLocalCommentsCount(post?.poststat_id?.comments || 0);
        setIsFollowedActive(post?.user_id?.isFollowing);
    }, [
        post?.isLiked,
        post?.poststat_id?.likes,
        post?.poststat_id?.reposts,
        post?.isBookmarked,
        post?.poststat_id?.comments,
        post?.user_id?.isFollowing
    ]);

    // API handlers with proper error handling and loading states
    const handleLike = useCallback(async () => {
        if (isLikeLoading || !post?._id) return;
        
        try {
            setIsLikeLoading(true);
            const newLikedState = !isLocalLiked;
            
            // Optimistic update
            setIsLocalLiked(newLikedState);
            setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

            const response = await AppApi.postAction(post._id, "like", "PATCH");

            if (!response.success) {
                // Revert on failure
                setIsLocalLiked(!newLikedState);
                setLocalLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
                throw new Error("Failed to like post");
            }

            const data = await response.data;
            if (data.likesCount !== undefined) {
                setLocalLikesCount(data.likesCount);
            }
        } catch (error) {
            console.error("Error liking post:", error);
            toast.error("Failed to update like. Please try again.");
        } finally {
            setIsLikeLoading(false);
        }
    }, [isLikeLoading, post?._id, isLocalLiked]);

    const handleRepost = useCallback(() => {
        if (isOwnPost) {
            toast.error("You cannot repost your own content");
            return;
        }
        setRepostConfirmOpen(true);
    }, [isOwnPost]);

    const performRepost = useCallback(async () => {
        if (isRepostLoading || !post?._id) return;

        try {
            setIsRepostLoading(true);
            const response = await AppApi.postAction(post._id, "repost", "PATCH");

            if (!response.success) {
                toast.error("Failed to repost");
                return;
            }

            toast.success(post?.isReposted ? "Repost deleted" : "Post reposted successfully");

            const data = await response.data;
            if (data.repostsCount !== undefined) {
                setLocalRepostsCount(data.repostsCount);
            }

            onPostUpdate?.();
        } catch (error) {
            console.error("Error reposting:", error);
            toast.error("Failed to repost. Please try again later.");
        } finally {
            setIsRepostLoading(false);
            setRepostConfirmOpen(false);
        }
    }, [isRepostLoading, post?._id, post?.isReposted, onPostUpdate]);

    const handleBookmark = useCallback(async () => {
        if (isBookmarkLoading || !post?._id) return;

        try {
            setIsBookmarkLoading(true);
            const newBookmarkState = !isBookmarkActive;
            setIsBookmarkActive(newBookmarkState);

            const response = await AppApi.postAction(post._id, "bookmark", "PATCH");

            if (!response.success) {
                setIsBookmarkActive(!newBookmarkState);
                throw new Error("Failed to bookmark post");
            }

            onPostUpdate?.();
            queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
        } catch (error) {
            console.error("Error bookmarking post:", error);
            toast.error("Failed to update bookmark. Please try again.");
        } finally {
            setIsBookmarkLoading(false);
        }
    }, [isBookmarkLoading, post?._id, isBookmarkActive, onPostUpdate, queryClient]);

    const handleFollow = useCallback(async () => {
        if (isFollowLoading || !post?.user_id?._id || !currentUserId) return;

        try {
            setIsFollowLoading(true);
            const newFollowState = !isFollowedActive;

            const response = await AppApi.handleFollow(post.user_id._id, currentUserId, newFollowState);

            if (!response.success) {
                throw new Error("Failed to update follow status");
            }
            console.log("Follow status updated successfully");
            queryClient.invalidateQueries({ 
            queryKey: ["posts"],
            exact: false 
            });
            queryClient.invalidateQueries({ 
                queryKey: ["bookmarkedPosts"],
                exact: false 
            });
            queryClient.invalidateQueries({ queryKey: ["userPosts", post.user_id._id] });
            onPostUpdate?.();

        } catch (error) {
            console.error("Error updating follow status:", error);
            toast.error("Failed to update follow status. Please try again.");
        } finally {
            setIsFollowLoading(false);
        }
    }, [isFollowLoading, post?.user_id?._id, currentUserId, isFollowedActive, queryClient]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!post?._id) return;

        try {
            const response = await AppApi.deletePost(post._id);
            
            if (!response.success) {
                throw new Error('Failed to delete post');
            }
            
            toast.success('Post deleted successfully');
            onPostUpdate?.();
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post. Please try again.');
        } finally {
            setDeleteConfirmOpen(false);
        }
    }, [post?._id, onPostUpdate]);

    const toggleComments = useCallback(() => {
        setIsCommentsOpen(!isCommentsOpen);
    }, [isCommentsOpen]);


    const handleCommentAdded = useCallback(() => {
        // getComments();
        onPostUpdate?.();
    }, [ onPostUpdate]);

    const handleReportSubmitted = useCallback(() => {
        onPostUpdate?.();
    }, [onPostUpdate]);

    const handleImageClick = useCallback(() => {
        setIsDialogOpen(true);
        // getComments();
    }, [ isDialogOpen]);

    // Memoized menu options
    const menuOptions = useMemo(() => [
        {
            icon: (
                <Bookmark
                    className={`h-5 w-5 ${
                        isBookmarkActive
                            ? "fill-current text-accent"
                            : "text-gray-500"
                    }`}
                />
            ),
            label: isBookmarkActive ? "Saved" : "Save",
            onClick: handleBookmark,
            disabled: isBookmarkLoading,
        },
        ...(!isOwnPost ? [
            {
                icon: (
                    <UserPlus
                        className={`h-5 w-5 ${
                            isFollowedActive
                                ? "fill-current text-accent"
                                : "text-gray-500"
                        }`}
                    />
                ),
                label: isFollowedActive ? "Unfollow" : "Follow",
                onClick: handleFollow,
                disabled: isFollowLoading,
            },
            {
                icon: <Flag className="h-5 w-5 text-gray-500" />,
                label: "Report post",
                onClick: () => setReportOpen(true),
                disabled: false,
            },
        ] : []),
        ...(isOwnPost ? [
            ...(!post?.original_post_id ? [{
                icon: <Pencil className="h-5 w-5 text-gray-500" />,
                label: "Edit post",
                onClick: () => setEditPostOpen(true),
                disabled: false,
            }] : []),
            {
                icon: <Trash className="h-5 w-5 text-gray-500" />,
                label: "Delete post",
                onClick: () => setDeleteConfirmOpen(true),
                disabled: false,
            },
        ] : []),
    ], [isBookmarkActive, isOwnPost, isFollowedActive, handleBookmark, handleFollow, isBookmarkLoading, isFollowLoading]);

    const postOptions = useMemo(() => [
        {
            icon: (
                <ThumbsUp
                    size={18}
                    className={
                        isLocalLiked
                            ? "fill-current font-bold"
                            : "text-gray-500"
                    }
                />
            ),
            label: isLocalLiked ? "Liked" : "Like",
            onClick: handleLike,
            isActive: isLocalLiked,
            disabled: isLikeLoading,
        },
        ...(!isDialogOpen ? [{
            icon: (
                <MessageCircle
                    size={18}
                    className={
                        isCommentsOpen
                            ? "fill-current"
                            : "text-gray-500"
                    }
                />
            ),
            label: "Comment",
            onClick: toggleComments,
            isActive: isCommentsOpen,
            disabled: false,
        }] : []),
        ...(!isOwnPost ? [{
            icon: (
                <Repeat
                    size={18}
                    className={
                        post?.isReposted
                            ? "fill-current"
                            : "text-gray-500"
                    }
                />
            ),
            label: post?.isReposted ? "Reposted" : "Repost",
            onClick: handleRepost,
            disabled: isRepostLoading,
        }] : []),
        {
            icon: <Send size={18} className="text-gray-500" />,
            label: "Share",
            onClick: () => setShareContentOpen(true),
            isActive: false,
            disabled: false,
        },
    ], [isLocalLiked, isDialogOpen, isCommentsOpen, isOwnPost, post?.isReposted, handleLike, toggleComments, handleRepost, isLikeLoading, isRepostLoading]);



    if (!post) {
        return null;
    }

    return (
        <div className="w-full border-b p-2 border-gray-300">
            {/* Header */}
            <div className="flex justify-between mb-3">
                <div className="flex items-center">
                    <Link href={`/profile/${post.user_id?._id}`}>
                        <ProfileAvatar
                            src={post.user_id?.profileImage || ''}
                            userName={post.user_id?.name || post.user_id?.username}
                            alt={post.user_id?.name}
                            size="xs"
                        />
                    </Link>
                    <div className="ml-2">
                        <div className="flex items-center">
                            <Link href={`/profile/${post.user_id?._id}`}>
                                <h4 className="font-semibold text-sm hover:underline">
                                    {post.user_id?.name || `@${post.user_id?.username}`}
                                </h4>
                            </Link>
                            {isFollowedActive && (
                                <span className="text-xs text-gray-500 ml-1.5">
                                    • Following
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Link href={`/profile/${post.user_id?._id}`}>
                                <span className="hover:underline">{ post.user_id?.name && `@${post.user_id?.username}`}</span>
                            </Link>
                            <div className="hidden md:block">
                                <span className="mx-1.5">-</span>
                                <span>{formatDate(post?.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Options menuOptions={menuOptions} />
            </div>

            {/* Content */}
            <div className="mb-3">
                <p className="text-sm mb-3">{post.content}</p>
                {postImages.length > 0 && (
                    <div
                        className="rounded-lg overflow-hidden aspect-video bg-gray-50 cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {postImages.length === 1 ? (
                            <Image
                                src={postImages[0]}
                                alt="Post"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-full h-full aspect-video object-contain"
                            />
                        ) : (
                            <BentoImageGrid images={postImages} />
                        )}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center text-xs border-b border-gray-200 text-gray-500 pb-3">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <ThumbsUp
                            size={10}
                            color="white"
                            className="text-white"
                        />
                    </div>
                    <span className="ml-1.5">{localLikesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>{localCommentsCount} comments</span>
                    <span>•</span>
                    <span>{localRepostsCount} reposts</span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-evenly pt-2">
                {postOptions.map((action, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center cursor-pointer justify-center gap-2 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            action.isActive
                                ? "font-bold"
                                : "font-medium hover:bg-gray-200"
                        }`}
                        onClick={action.onClick}
                        disabled={action.disabled}
                    >
                        {action.icon}
                        <span className="text-xs md:text-sm">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Comments */}
            {isCommentsOpen && (
                <div className="p-2">
                    <CommentSection
                        post_id={post._id}
                        isOpen={isCommentsOpen}
                        onCommentAdded={handleCommentAdded}
                    />
                </div>
            )}

            {/* Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent showDialogClose={false} className="lg:min-w-6xl  min-w-screen lg:rounded-lg lg:h-[80vh] h-dvh flex flex-col lg:flex-row p-0 ">
                    <DialogClose className="absolute z-20 top-2 cursor-pointer right-2 p-1 rounded-full bg-black/20">
                        <X color="white" size={20}/>
                    </DialogClose>
                    <DialogTitle className="sr-only hidden">Social Media Post</DialogTitle>
                    <DialogDescription className="sr-only hidden">
                        {post.content}
                    </DialogDescription>

                    {/* Image Carousel */}
                    <div className="h-[40vh] lg:h-full w-full lg:w-2/3 rounded-b-lg lg:rounded-lg border-r-2 bg-[#1E1E1E] overflow-hidden flex-shrink-0">
                        {postImages.length > 0 ? (
                            <ImageCarousel
                                images={postImages}
                                className="w-full h-full"
                            />
                        ) : ''}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col h-full w-full lg:w-1/3 overflow-hidden">
                        {/* Header */}
                        <div className="flex px-4 my-2 lg:my-4 justify-between items-center flex-shrink-0">
                            <div className="flex items-center">
                                <ProfileAvatar
                                    src={post.user_id?.profileImage || ""}
                                    userName={post.user_id?.name || post.user_id?.username}
                                    alt={post.user_id?.name}
                                    size="sm"
                                />
                                <div className="ml-2">
                                    <div className="flex items-center">
                                        <Link href={`/profile/${post.user_id?._id}`}>
                                            <h4 className="font-semibold text-sm hover:underline">
                                                {post.user_id?.name}
                                            </h4>
                                        </Link>
                                    </div>
                                    <div className="flex flex-col justify-center text-xs text-gray-500">
                                        <Link href={`/profile/${post.user_id?._id}`}>
                                            <span className="hover:underline">@{post.user_id?.username}</span>
                                        </Link>
                                        <span className="flex">
                                            {formatDate(post?.createdAt)}{isFollowedActive && ' • Following'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Options menuOptions={menuOptions}/>
                        </div>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto flex-1 flex flex-col max-h-[calc(100vh-15rem)] lg:max-h-none">
                            <div className="px-4 flex-shrink-0">
                                <h2 className="text-lg font-medium mb-3">
                                    {post.content}
                                </h2>

                                {/* Stats */}
                                <div className="flex justify-between text-sm text-gray-500 mb-3">
                                    <div className="flex items-center">
                                        <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center mr-1">
                                            <ThumbsUp size={12} color="white" />
                                        </div>
                                        <span>{localLikesCount}</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span>{localCommentsCount} comments</span>
                                        <span>{localRepostsCount} reposts</span>
                                    </div>
                                </div>
                                <ColoredDivider />

                                {/* Action buttons */}
                                <div className="flex justify-evenly my-3">
                                    {postOptions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.onClick}
                                            disabled={action.disabled}
                                            aria-label={action.label}
                                            className={`flex w-full cursor-pointer justify-center items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                                action.isActive
                                                    ? "text-accent font-medium"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {action.icon}
                                            <span>{action.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Comments section */}
                                <div className="flex-1 overflow-y-auto px-4 pb-2 border-t border-gray-100 pt-2">
                                    <CommentSection
                                        post_id={post._id}
                                        isOpen={true}
                                        onCommentAdded={handleCommentAdded}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modals */}
            <ReportPopover
                open={reportOpen}
                onOpenChange={setReportOpen}
                id={post._id}
                onReportSubmitted={handleReportSubmitted}
            />
            <EditPost
                open={editPostOpen}
                onOpenChange={setEditPostOpen}
                postId={post._id}
                initialContent={post.content}
                onPostUpdate={onPostUpdate}
                images={postImages}
            />
            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                clickFunc={handleDeleteConfirm}
                subject="Delete"
                object="post"
            />
            <ConfirmationDialog
                open={repostConfirmOpen}
                onOpenChange={setRepostConfirmOpen}
                clickFunc={performRepost}
                subject={post.isReposted ? "Delete" : "Repost"}
                object={post.isReposted ? "Repost" : "post"}
            />
            <ShareContent
                open={shareContentOpen}
                onOpenChange={setShareContentOpen}
                contentUrl={`/post/${post._id}`}
                itemId={post._id}
            />
        </div>
    );
});

PostCard.displayName = 'PostCard';
