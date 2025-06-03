"use client";
import React, { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import Image from "next/image";
import CommentSection from "../post/CommentSection";
import { CommentData } from "@/service/api.interface";
import ProfileAvatar from "../profile/ProfileAvatar";
import { SocialPostDialog } from "../post/FocusedPost";
import ReportPopover from "../post/ReportPopover";
import EditPost from "../post/EditPost";
import { useUser } from "@/lib/redux/features/user/hooks";
import { BentoImageGrid } from "../post/BentoGrid";
import Link from "next/link";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "../ConfirmationDialog";
import ShareContent from "../post/ShareContent";
import { is } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";

interface PostCardProps {
    _id: string;
    name: string;
    handle: string;
    time: string;
    //   isVerified?: boolean;
    content: string;
    isLiked: boolean;
    isReposted?: boolean;
    userId: string;
    isBookmarked: boolean;
    imageUrl: string[];
    avatar: string;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    isFollowed?: boolean;
    isCommentOpen?: boolean;
    onPostUpdate?: () => void; // Add callback for post updates
}

export const PostCard: React.FC<PostCardProps> = ({
    _id,
    name,
    handle,
    time,
    isReposted,
    content,
    imageUrl,
    isLiked,
    isBookmarked,
    userId,
    likesCount,
    isCommentOpen = false,
    commentsCount,
    avatar,
    repostsCount,
    isFollowed,
    onPostUpdate,
}) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(isCommentOpen);
    const [comments, setComments] = useState<CommentData[]>([]);
    // Add state for local comment count
    const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);
    const [isActive, setIsActive] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [localLikesCount, setLocalLikesCount] = useState(likesCount);
    const [isLocalLiked, setIsLocalLiked] = useState(isLiked);
    // const [isRepostActive, setIsRepostActive] = useState(isReposted);
    const [localRepostsCount, setLocalRepostsCount] = useState(repostsCount);

    // PostMenu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [reportOpen, setReportOpen] = useState(false);
    const [editPostOpen, setEditPostOpen] = useState(false);
    const [deletePostOpen, setDeletePostOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // New state for delete confirmation
    const [isBookmarkActive, setIsBookmarkActive] = useState(isBookmarked);
    const [isFollowedActive, setIsFollowedActive] = useState(isFollowed);
    const [repostConfirmOpen, setRepostConfirmOpen] = useState(false);
    const [shareContentOpen, setShareContentOpen] = useState(false);

    const { user } = useUser();
    const currentUserId = user?._id;
    const queryClient = useQueryClient();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Add click outside listener to close the menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click was outside both the menu and the toggle button
            if (
                isMenuOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            }
        };

        // Add event listener when menu is open
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Update this useEffect to properly sync with all prop changes 
    useEffect(() => {
        setIsActive(isLiked);
        setIsLocalLiked(isLiked);
        setLocalLikesCount(likesCount);
        setIsBookmarkActive(isBookmarked);
        setLocalRepostsCount(repostsCount);
        setLocalCommentsCount(commentsCount);
        setIsFollowedActive(isFollowed);
    }, [isLiked, likesCount, isReposted, repostsCount, isBookmarked, commentsCount, isFollowed]);

    const toggleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
        {
            !isCommentsOpen && getComments();
        }
    };

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
            if (data.likesCount !== undefined) {
                setLocalLikesCount(data.likesCount);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
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
                toast.error("Failed to repost");
                return;
            } 

            toast.success(isReposted ? "Repost Deleted" : "Post reposted successfully");


            // Get updated data from API response
            const data = await response.json();
            if (data.repostsCount !== undefined) {
                setLocalRepostsCount(data.repostsCount);
            }

            // Invalidate query to fetch updated posts including the new repost
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error("Error reposting:", error);
            toast.error("Failed to repost. Please try again later.");
        }

        // Close the dialog
        setRepostConfirmOpen(false);
    };

    // PostMenu handlers
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
                // Revert changes if API call fails
                setIsBookmarkActive(!newBookmarkState);
                throw new Error("Failed to bookmark post");
            }
            if (onPostUpdate) {
                onPostUpdate();
            }
            queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });

            // Get updated data from API response
            const data = await response.json();
            console.log("Bookmark updated successfully", data);
        } catch (error) {
            console.error("Error bookmarking post:", error);
        }
    };

    const handleEditPost = () => {
        setIsMenuOpen(false);
        setEditPostOpen(true);
    };

    const handleDeletePost = () => {
        setIsMenuOpen(false);
        setDeleteConfirmOpen(true); // Open confirmation dialog instead
    };

    // New function to handle deletion after confirmation
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/post`, {
                method: 'DELETE',
                body: JSON.stringify({ postId: _id }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            
            // Handle successful deletion
            toast.success('Post deleted successfully');
            
            
            // Refresh posts data after successful deletion
            if (onPostUpdate) {
                onPostUpdate();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post. Please try again.');
        } finally {
            // Close the dialog
            setDeleteConfirmOpen(false);
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
            queryClient.invalidateQueries({ queryKey: ["bookmarkedPosts"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });

            const data = await response.json();
            console.log("Follow status updated successfully", data);
        } catch (error) {
            console.error("Error updating follow status:", error);
            // Consider showing a toast notification here for error feedback
        }
    };

    // Handle report submission completion
    const handleReportSubmitted = () => {
        // Refresh posts data after successful report
        if (onPostUpdate) {
            onPostUpdate();
        }
    };

    const handleShare = () => {
        setShareContentOpen(true);
    };

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
            label: isBookmarkActive ? "Saved" : "Save",
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
        {
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
        },
        ...(userId !== currentUserId
            ? [
                {
                    icon: (
                        <Repeat
                            size={18}
                            className={
                                isReposted
                                    ? "fill-current"
                                    : "text-gray-500"
                            }
                        />
                    ),
                    label: isReposted ? "Reposted" : "Repost",
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

    const getComments = async () => {
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

            const { data } = await response.json();
            setComments(data);

            console.log("Fetched successfully", comments);
            console.log(isLiked);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Update comment handling
    const handleCommentAdded = () => {
        // Increment the local comment count
        setLocalCommentsCount((prevCount) => prevCount + 1);
        
        // Refresh comments
        getComments();
        
        // Notify any parent components
        if (onPostUpdate) {
            onPostUpdate();
        }
    };

    // When dialog is open, ensure we have latest data
    const handleImageClick = () => {
        setIsDialogOpen(true);
        getComments();
    };

    return (
        <div className="w-full border-b  p-2 border-gray-300">
            {/* {isReposted && (
          <div className=" py-2 border-b px-4 mb-2  text-sm text-gray-500">
            <Link href={`/profile/${userId}`} className="font-bold hover:underline">{name}</Link> reposted this
          </div>
        )} */}
            <div className="flex justify-between mb-3">
                <div className="flex items-center">
                    <Link href={`/profile/${userId}`}>
                        <ProfileAvatar
                            src={avatar}
                            alt={name}
                            size="xs"
                        />
                    </Link>
                    <div className="ml-2">
                        <div className="flex items-center">
                            <Link href={`/profile/${userId}`}>
                                <h4 className="font-semibold text-sm hover:underline">
                                    {name}
                                </h4>
                            </Link>
                            {isFollowedActive && (
                                <span className="text-xs text-gray-500 ml-1.5">
                                    • Following
                                </span>
                            )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Link href={`/profile/${userId}`}>
                                <span className="hover:underline">{handle}</span>
                            </Link>
                            <div className="hidden md:block">
                                <span className="mx-1.5">•</span>
                                <span>{time}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Post Menu */}
                    <div className="relative">
                        <button
                            ref={buttonRef} // Add ref to the button
                            onClick={toggleMenu}
                            className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                            aria-label="More options"
                        >
                            <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>

                        {isMenuOpen && (
                            <div
                                ref={menuRef} // Add ref to the menu
                                className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg z-50 border border-gray-100 overflow-hidden"
                                onClick={closeMenu}
                            >
                                <div className="py-1">
                                    {menuOptions.map((item, index) => (
                                        <button
                                            key={index}
                                            className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                item.onClick();
                                            }}
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

            <div className="mb-3">
                <p className="text-sm mb-3">{content}</p>
                {imageUrl && imageUrl.length > 0 && (
                    <div
                        className="rounded-lg overflow-hidden aspect-video bg-gray-50 cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {imageUrl.length === 1 ? (
                            <Image
                                src={imageUrl[0]}
                                alt="Post"
                                width={0}
                                height={0}
                                sizes="100vw"
                                className="w-full h-full aspect-video object-contain"
                            />
                        ) : (
                            <BentoImageGrid images={imageUrl} />
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
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
                    {/* <span>•</span>
          <span>{repostsCount} reposts</span> */}
                </div>
            </div>
            <div className="w-full border border-gray-200" />
            <div className="flex justify-evenly pt-2 ">
                {postOptions.map((action, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center cursor-pointer justify-center gap-2 py-2 rounded-xl transition-colors duration-200 ${
                            action.isActive
                                ? "font-bold"
                                : "font-medium hover:bg-gray-200 "
                        }`}
                        onClick={action.onClick}
                    >
                        {action.icon}
                        <span className="text-xs md:text-sm">{action.label}</span>
                    </button>
                ))}
            </div>
            <div className={isCommentsOpen ? "p-2" : "hidden"}>
                <CommentSection
                    post_id={_id}
                    isOpen={isCommentsOpen}
                    comments={comments}
                    onCommentAdded={handleCommentAdded} // Use the new handler
                />
            </div>
            {/* Modals and Popovers */}
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
                onPostUpdate={onPostUpdate}
                images={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
            />
            <ConfirmationDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                clickFunc={handleDeleteConfirm}
                subject="Delete"
                object="post"
            />
            <SocialPostDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                _id={_id}
                name={name}
                handle={handle}
                userId={userId}
                time={time}
                content={content}
                isLiked={isLocalLiked} // Use local state here
                isBookmarked={isBookmarkActive} // Use local state here
                imageUrl={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
                avatar={avatar}
                likesCount={localLikesCount} // Use local state here
                commentsCount={localCommentsCount} // Use local state here
                repostsCount={localRepostsCount} // Use local state here 
                comments={comments}
                onPostUpdate={() => {
                    // First update local state
                    getComments();
                    // Then propagate update to parent
                    if (onPostUpdate) onPostUpdate();
                }}
            />
            {/* Add this near the bottom of your component, with the other dialogs */}
            <ConfirmationDialog
                open={repostConfirmOpen}
                onOpenChange={setRepostConfirmOpen}
                clickFunc={performRepost}
                subject={isReposted ? "Delete" :"Repost"}
                object={isReposted ? "Repost":"post"}
            />
            <ShareContent
                open={shareContentOpen}
                onOpenChange={setShareContentOpen}
                contentUrl={`/post/${_id}`}
                itemId={_id}
            />
        </div>
    );
};
