import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    X,
    ThumbsUp,
    MessageSquare,
    Repeat2,
    Share,
    MessageCircle,
    Bookmark,
    Flag,
    MoreVertical,
    Pencil,
    Trash,
    UserPlus,
    Repeat,
    Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PostMenu from "./PostMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import CommentSection from "./CommentSection";
import ProfileAvatar from "../profile/ProfileAvatar";
import { CommentData } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import EditPost from "./EditPost";
import ReportPopover from "./ReportPopover";
import ImageCarousel from "./ImageCarousel";
import ConfirmationDialog from "../ConfirmationDialog";
import { toast } from "react-hot-toast";
import ShareContent from "./ShareContent";

interface SocialPostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    _id: string;
    name: string;
    handle: string;
    time: string;
    isVerified?: boolean;
    content: string;
    isLiked: boolean;
    imageUrl: string[];
    avatar: string;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    comments: CommentData[];
    isBookmarked: boolean;
    userId: string;
    isFollowed?: boolean; // Add this missing prop
    onPostUpdate?: () => void;
}

export function SocialPostDialog({
    open,
    onOpenChange,
    avatar,
    name,
    handle,
    time,
    _id,
    content,
    isLiked,
    imageUrl,
    likesCount,
    commentsCount,
    repostsCount,
    comments,
    isBookmarked,
    userId,
    onPostUpdate,
}: SocialPostDialogProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isActive, setIsActive] = useState(isLiked);
    const [reportOpen, setReportOpen] = useState(false);
    const [editPostOpen, setEditPostOpen] = useState(false);
    const [deletePostOpen, setDeletePostOpen] = useState(false);
    const [isBookmarkActive, setIsBookmarkActive] = useState(isBookmarked);
    const [localLikesCount, setLocalLikesCount] = useState(likesCount);
    const [isLocalLiked, setIsLocalLiked] = useState(isLiked);
    const [isRepostActive, setIsRepostActive] = useState(false);
    const [localRepostsCount, setLocalRepostsCount] = useState(repostsCount);
    const [repostConfirmOpen, setRepostConfirmOpen] = useState(false);
    const [isFollowedActive, setIsFollowedActive] = useState(false);
    const [shareContentOpen, setShareContentOpen] = useState(false);

    const { user } = useUser();
    const currentUserId = user?._id;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLike = async () => {
        try {
            // Optimistically update UI
            const newLikedState = !isLocalLiked;
            setIsActive(newLikedState);
            setIsLocalLiked(newLikedState);
            setLocalLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

            const response = await fetch(`/api/post/post-action`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actionType: "like",
                    postId: _id,
                }),
            });

            if (!response.ok) {
                // Revert changes if API call fails
                setIsActive(isLocalLiked);
                setIsLocalLiked(!newLikedState);
                setLocalLikesCount((prev) =>
                    newLikedState ? prev - 1 : prev + 1
                );
                throw new Error("Failed to like post");
            }

            // Get updated data from API response
            const data = await response.json();
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleShare = () => {
        setShareContentOpen(true);
    };

    const handleRepost = () => {
        // Check if the post belongs to the current user
        if (userId === currentUserId) {
            toast.error("You cannot repost your own content");
            return;
        }

        // Open the confirmation dialog
        setRepostConfirmOpen(true);
    };

    const performRepost = async () => {
        try {
            // Optimistically update UI
            const newRepostState = !isRepostActive;
            setIsRepostActive(newRepostState);
            setLocalRepostsCount((prev) =>
                newRepostState ? prev + 1 : prev - 1
            );

            const response = await fetch(`/api/post/post-action`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actionType: "repost",
                    postId: _id,
                }),
            });

            if (!response.ok) {
                // Revert changes if API call fails
                setIsRepostActive(!newRepostState);
                setLocalRepostsCount((prev) =>
                    newRepostState ? prev - 1 : prev + 1
                );
                throw new Error("Failed to repost");
            }

            // Get updated data from API response
            const data = await response.json();
            if (data.repostsCount !== undefined) {
                setLocalRepostsCount(data.repostsCount);
            }

            // Invalidate query to fetch updated posts
            if (onPostUpdate) {
                onPostUpdate();
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error("Error reposting:", error);
            toast.error("Failed to repost. Please try again later.");
        }

        // Close the confirmation dialog
        setRepostConfirmOpen(false);
    };

    const handleReportClick = () => {
        setIsMenuOpen(false);
        setReportOpen(true);
    };

    const handleBookmark = async () => {
        try {
            // Optimistically update UI
            const newBookmarkState = !isBookmarkActive;
            setIsBookmarkActive(newBookmarkState);

            const response = await fetch(`/api/post/post-action`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actionType: "bookmark",
                    postId: _id,
                }),
            });

            if (!response.ok) {
                setIsBookmarkActive(!newBookmarkState);
                throw new Error("Failed to bookmark post");
            } 
            
            // Parse response data first
            const data = await response.json();
            console.log("Bookmark updated successfully", data);
            
            // Then update parent component
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error bookmarking post:", error);
            toast.error("Failed to bookmark post. Please try again.");
        }
    };

    const handleEditPost = () => {
        setIsMenuOpen(false);
        setEditPostOpen(true);
    };

    const handleDeletePost = () => {
        setIsMenuOpen(false);
        setDeletePostOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            const response = await fetch(`/api/post`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: _id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            toast.success("Post deleted successfully");

            // Close the dialog and refresh posts
            setDeletePostOpen(false);
            onOpenChange(false);

            // Update posts if callback is provided
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post. Please try again.");
        }
    };

    // Handle report submission completion
    const handleReportSubmitted = () => {
        // Refresh posts data after successful report
        if (onPostUpdate) {
            onPostUpdate();
        }
    };

    // Update comments when new comment is added
    const handleCommentAdded = async () => {
        try {
            const response = await fetch(`/api/post/post-action`, {
                method: "POST",
                body: JSON.stringify({
                    actionType: "comment",
                    postId: _id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }
            
            // Notify parent about the comment update
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleFollow = async () => {
        try {
            // Optimistically update UI
            const newFollowState = !isFollowedActive;
            setIsFollowedActive(newFollowState);

            // Close the menu after action is taken
            setIsMenuOpen(false);

            // Make the API call
            const response = await fetch("/api/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    followingId: userId,
                    userId: currentUserId,
                    action: newFollowState ? "follow" : "unfollow",
                }),
            });

            if (!response.ok) {
                // If API fails, revert UI change
                setIsFollowedActive(!newFollowState);
                throw new Error("Failed to update follow status");
            }

            const data = await response.json();
            console.log("Follow status updated successfully", data);
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };

    // Add this useEffect to update local state when props change
    useEffect(() => {
        setIsActive(isLiked);
        setIsLocalLiked(isLiked);
        setLocalLikesCount(likesCount);
        setIsBookmarkActive(isBookmarked);
        setLocalRepostsCount(repostsCount);
    }, [isLiked, likesCount, repostsCount, isBookmarked, comments]);

    const menuOptions = [
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
            label: isBookmarked ? "Unsave post" : "Save post",
            onClick: handleBookmark,
        },
        ...(userId !== currentUserId
            ? [
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
                    },
                    {
                        icon: <Flag className="h-5 w-5 text-gray-500" />,
                        label: "Report post",
                        onClick: handleReportClick,
                    },
                ]
                : []),
            ...(userId === currentUserId
                ? [
                    {
                        icon: <Pencil className="h-5 w-5 text-gray-500" />,
                        label: "Edit post",
                        onClick: handleEditPost,
                    },
                    {
                        icon: <Trash className="h-5 w-5 text-gray-500" />,
                        label: "Delete post",
                        onClick: handleDeletePost,
                    },
                ]
            : []),
    ];

    const postOptions = [
        {
            icon: (
                <ThumbsUp
                    size={18}
                    className={
                        isActive
                            ? "fill-current font-bold"
                            : "text-gray-500"
                    }
                />
            ),
            label: isActive ? "Liked" : "Like",
            onClick: handleLike,
            isActive: isActive,
        },
        ...(userId !== currentUserId
            ? [
                {
                    icon: (
                        <Repeat
                            size={18}
                            className={
                                isRepostActive
                                    ? "fill-current"
                                    : "text-gray-500"
                            }
                        />
                    ),
                    label: isRepostActive ? "Reposted" : "Repost",
                    onClick: handleRepost,
                },
            ]
            : []),
        {
            icon: <Send size={18} className="text-gray-500" />,
            label: "Share",
            onClick: handleShare,
            isActive: false,
        },
    ];

    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showDialogClose={false} className="lg:min-w-6xl rounded-lg h-[80vh] flex flex-col lg:flex-row p-0">
                <DialogTitle className="sr-only">Social Media Post</DialogTitle>
                <DialogDescription className="sr-only">
                    {content}
                </DialogDescription>

                {/* Left side - Image Carousel - Fixed height to prevent shrinking */}
                <div className="h-[40vh] lg:h-full w-full lg:w-2/3 rounded-lg border-r-2 bg-[#1E1E1E] overflow-hidden flex-shrink-0">
                    {imageUrl && imageUrl.length > 0 && (
                        <ImageCarousel
                            images={
                                Array.isArray(imageUrl) ? imageUrl : [imageUrl]
                            }
                            className="w-full h-full"
                        />
                    )}
                </div>

                {/* Right side - Content with fixed layout */}
                <div className="flex flex-col h-full w-full lg:w-1/3 overflow-hidden">
                    {/* Header with profile info - Fixed height, non-scrollable */}
                    <div className="flex px-4 my-2 lg:my-4 justify-between flex-shrink-0">
                        <div className="flex items-center">
                            <ProfileAvatar
                                src={avatar}
                                alt={name}
                                size="sm"
                            />
                            <div className="ml-2">
                                <div className="flex items-center">
                                    <h4 className="font-semibold text-sm">
                                        {name}
                                    </h4>
                                    {/* <span className="text-xs text-gray-500 ml-1.5">• Following</span> */}
                                </div>
                                <div className="flex flex-col justify-center text-xs text-gray-500">
                                    <span>{handle}</span>
                                    {/* <span className="mx-1.5">•</span> */}
                                    <span className="flex">
                                        {time}{isFollowedActive && '• Following'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                                    aria-label="More options"
                                >
                                    <MoreVertical className="h-5 w-5 text-gray-500" />
                                </button>

                                {isMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg z-50 border border-gray-100 overflow-hidden"
                                        onClick={closeMenu}
                                    >
                                        <div className="py-1">
                                            {menuOptions.map((item, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                                    onClick={item.onClick}
                                                >
                                                    {item.icon}
                                                    <span className="text-gray-700">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content area with scrolling */}
                    <div className="overflow-y-auto flex-1 flex flex-col max-h-[calc(100vh-15rem)] lg:max-h-none">
                        <div className="px-4 flex-shrink-0">
                            <h2 className="text-lg font-medium mb-3">
                                {content}
                            </h2>

                            {/* Engagement stats */}
                            <div className="flex justify-between text-sm text-gray-500 mb-3">
                                <div className="flex items-center">
                                    <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center mr-1">
                                        <ThumbsUp size={12} color="white" />
                                    </div>
                                    <span>{localLikesCount}</span>
                                </div>
                                <div className="flex gap-4">
                                    <span>{commentsCount} comments</span>
                                    <span>{localRepostsCount} reposts</span>
                                </div>
                            </div>
                            <div className="flex h-1 w-full">
                                <div className="flex-1 bg-[#E5243B]/60"></div>
                                <div className="flex-1 bg-[#DDA63A]/60"></div>
                                <div className="flex-1 bg-[#4C9F38]/60"></div>
                                <div className="flex-1 bg-[#C5192D]/60"></div>
                                <div className="flex-1 bg-[#FF3A21]/60"></div>
                                <div className="flex-1 bg-[#26BDE2]/60"></div>
                                <div className="flex-1 bg-[#FCC30B]/60"></div>
                                <div className="flex-1 bg-[#A21942]/60"></div>
                                <div className="flex-1 bg-[#FD6925]/60"></div>
                                <div className="flex-1 bg-[#DD1367]/60"></div>
                                <div className="flex-1 bg-[#FD9D24]/60"></div>
                                <div className="flex-1 bg-[#BF8B2E]/60"></div>
                                <div className="flex-1 bg-[#3F7E44]/60"></div>
                                <div className="flex-1 bg-[#0A97D9]/60"></div>
                                <div className="flex-1 bg-[#56C02B]/60"></div>
                                <div className="flex-1 bg-[#00689D]/60"></div>
                                <div className="flex-1 bg-[#19486A]/60"></div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex justify-between my-3">
                                {postOptions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.onClick}
                                        aria-label={action.label}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm ${
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
                                    post_id={_id}
                                    isOpen={true}
                                    comments={comments}
                                    onCommentAdded={handleCommentAdded}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional components */}
                <ReportPopover
                    open={reportOpen}
                    onOpenChange={setReportOpen}
                    id={_id}
                    onReportSubmitted={handleReportSubmitted}
                />
                <EditPost
                    open={editPostOpen}
                    onOpenChange={setEditPostOpen}
                    postId={_id}
                    initialContent={content}
                    images={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
                    onPostUpdate={onPostUpdate}
                />
                <ConfirmationDialog
                    open={deletePostOpen}
                    onOpenChange={setDeletePostOpen}
                    clickFunc={handleDeleteConfirmed}
                    subject="Delete"
                    object="post"
                />
                <ConfirmationDialog
                    open={repostConfirmOpen}
                    onOpenChange={setRepostConfirmOpen}
                    clickFunc={performRepost}
                    subject="Repost"
                    object="post"
                />
            </DialogContent>
            <ShareContent
                open={shareContentOpen}
                onOpenChange={setShareContentOpen}
                contentUrl={`/post/${_id}`}
                itemId={_id}
            />
        </Dialog>
    );
}
