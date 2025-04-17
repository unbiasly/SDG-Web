'use client';
import React, { useEffect, useState } from 'react';
import { ThumbsUp, MessageCircle, Bookmark, Flag, MoreVertical, Pencil, Trash, Repeat2 } from 'lucide-react';
import Image from 'next/image';
import CommentSection from '../post/CommentSection';
import { CommentData } from '@/service/api.interface';
import ProfileAvatar from '../profile/ProfileAvatar';
import { SocialPostDialog } from '../post/FocusedPost';
import ReportPopover from '../post/ReportPopover';
import EditPost from '../post/EditPost';
import { useUser } from '@/lib/redux/features/user/hooks';
import { BentoImageGrid } from '../post/BentoGrid';
import DeletePostModal from '../post/DeletePostModal';
import Link from 'next/link';

interface PostCardProps {
  _id: string;
  name: string;
  handle: string;
  time: string;
  isVerified?: boolean;
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
}

export const PostCard: React.FC<PostCardProps> = ({
  _id,
  name,
  handle,
  time,
  isVerified = false,
  isReposted = false,
  content,
  imageUrl,
  isLiked,
  isBookmarked,
  userId,
  likesCount,
  commentsCount,
  avatar,
  repostsCount
}) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [isActive, setIsActive] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [localLikesCount, setLocalLikesCount] = useState(likesCount);
    const [isLocalLiked, setIsLocalLiked] = useState(isLiked);
    
    // PostMenu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [editPostOpen, setEditPostOpen] = useState(false);
    const [deletePostOpen, setDeletePostOpen] = useState(false);
    const [isBookmarkActive, setIsBookmarkActive] = useState(isBookmarked);
    
    const { user } = useUser();
    const currentUserId = user?._id;
    
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        setIsActive(isLiked);
        setIsLocalLiked(isLiked);
        setLocalLikesCount(likesCount);
    }, [isLiked, likesCount]);

    const toggleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
        {!isCommentsOpen && getComments() } 
    };
    
    const handleLike = async () => {
        try {
            // Optimistically update UI
            const newLikedState = !isLocalLiked;
            setIsActive(newLikedState);
            setIsLocalLiked(newLikedState);
            setLocalLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
            
            const response = await fetch(`/api/post/post-action`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    actionType: 'like',
                    postId: _id
                })
            });
            
            if (!response.ok) {
                // Revert changes if API call fails
                setIsActive(isLocalLiked);
                setIsLocalLiked(!newLikedState);
                setLocalLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
                throw new Error('Failed to like post');
            }
            
            // Get updated data from API response
            const data = await response.json();
            if (data.likesCount !== undefined) {
                setLocalLikesCount(data.likesCount);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

    const handleRepost = async () => {
        try {
            // Optimistically update UI
            const newRepostState = !isActive;
            setIsActive(newRepostState);
            setLocalLikesCount(prev => newRepostState ? prev + 1 : prev - 1);const response = await fetch(`/api/post/post-action`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    actionType: 'repost',
                    postId: _id
                })
            });
            if (!response.ok) {
                // Revert changes if API call fails
                setIsActive(!newRepostState);
                setLocalLikesCount(prev => newRepostState ? prev - 1 : prev + 1);
                throw new Error('Failed to repost');
            }
            // Get updated data from API response
            const data = await response.json();
            if (data.repostsCount !== undefined) {
                setLocalLikesCount(data.repostsCount);
            }
            window.location.reload();
        } catch (error) {
            console.error('Error reposting:', error);
        }
    }

    
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
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                actionType: 'bookmark',
                postId: _id
            })
          });
          
          if (!response.ok) {
              // Revert changes if API call fails
              setIsBookmarkActive(!newBookmarkState);
              throw new Error('Failed to bookmark post');
          }
          
          // Get updated data from API response
          const data = await response.json();
          console.log('Bookmark updated successfully', data);
      } catch (error) {
          console.error('Error bookmarking post:', error);
      }
    }
    
    const handleEditPost = () => {
      setIsMenuOpen(false);
      setEditPostOpen(true);
    }
    
    const handleDeletePost = () => {
      setIsMenuOpen(false);
      setDeletePostOpen(true);
    }
    
    const menuOptions = [
      { icon: <Flag className="h-5 w-5 text-gray-500" />, label: "Report post", onClick: handleReportClick },
      { icon: <Bookmark className={`h-5 w-5 ${isBookmarkActive ? "fill-current text-accent" : "text-gray-500"}`} />, label: isBookmarked ? "Saved" : "Save", onClick: handleBookmark },
      ...(userId === currentUserId ? [
        { icon: <Pencil className="h-5 w-5 text-gray-500" />, label: "Edit post", onClick: handleEditPost },
        { icon: <Trash className="h-5 w-5 text-gray-500" />, label: "Delete post", onClick: handleDeletePost },
      ] : []),
    ];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: name,
                text: content,
                url: window.location.href,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            console.log('Web Share API not supported in this browser');
            // Fallback sharing mechanism could be implemented here
        }
    }
    
    const getComments = async () => {
        try {
            const response = await fetch(`/api/post/post-action`, {
                method: 'POST',
                body: JSON.stringify({
                    actionType: 'comment',
                    postId: _id
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            
            const { data } = await response.json();
            setComments(data);
            
            console.log('Fetched successfully', comments);
            console.log(isLiked)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    } 
    
  return (
    <div className="w-full border-b  p-2 border-gray-300">
        {isReposted && (
          <div className=" py-2 border-b px-4 mb-2  text-sm text-gray-500">
            <Link href={`/profile/${userId}`} className="font-bold hover:underline">{name}</Link> reposted this
          </div>
        )}
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
            <Link href={`/profile/${userId}`}>
                <ProfileAvatar src={avatar} alt={name} size='xs' className='' />
            </Link>
          <div className="ml-2">
            <div className="flex items-center">
                <Link href={`/profile/${userId}`}>
                    <h4 className="font-semibold text-sm">{name}</h4>
                </Link>
              {/* <span className="text-xs text-gray-500 ml-1.5">• Reposted</span> */}
            </div>
            <div className="flex items-center text-xs text-gray-500">
                <Link href={`/profile/${userId}`}>
                    <span>{handle}</span>
                </Link>
              <span className="mx-1.5">•</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Post Menu */}
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
                      <span className="text-gray-700">{item.label}</span>
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
            className="cursor-pointer rounded-lg overflow-hidden aspect-video bg-gray-50" 
            onClick={() => {
              setIsDialogOpen(true);
              getComments();
            }}
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
            <ThumbsUp size={10} color='white' className="text-white" />
          </div>
          <span className="ml-1.5">{localLikesCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{commentsCount} comments</span>
          {/* <span>•</span>
          <span>{repostsCount} reposts</span> */}
        </div>
      </div>
      
      <div className="flex h-1 w-full my-2">
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
      
      <div className="flex justify-evenly pt-2 ">
        {[
            { icon: <ThumbsUp size={18}  className={isActive ? "fill-current font-bold" : "text-gray-500"} />, label: "Like", onClick: handleLike, isActive: isActive },
            { icon: <MessageCircle size={18} className={isCommentsOpen ? "fill-current" : "text-gray-500"} />, label: "Comment", onClick: toggleComments, isActive: isCommentsOpen },
            { icon: <Repeat2 size={18}  />, label: "Repost", onClick: handleRepost, isActive: false },
            //   { icon: <Share2 size={18} className="text-gray-500" />, label: "Share", onClick: handleShare, isActive: false }
        ].map((action, index) => (
            <button 
            key={index}
            className={`w-50 flex items-center cursor-pointer justify-center gap-2 py-1.5 rounded-xl transition-colors duration-200 ${action.isActive ?  "font-bold bg-gray-300" : "font-medium hover:bg-gray-200 "}`}
            onClick={action.onClick}
            >
            {action.icon}
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>
      <div className={ isCommentsOpen ? "p-2" : "hidden"}>
        <CommentSection 
          post_id={_id}
          isOpen={isCommentsOpen} 
          comments={comments}
          onCommentAdded={getComments}
        />
      </div>
      
      {/* Modals and Popovers */}
      <ReportPopover open={reportOpen} onOpenChange={setReportOpen} postId={_id} />
      <EditPost 
        open={editPostOpen} 
        onOpenChange={setEditPostOpen} 
        postId={_id} 
        initialContent={content}
        images={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
      />
      <DeletePostModal 
        open={deletePostOpen}
        onOpenChange={setDeletePostOpen}
        postId={_id}
      />
      <SocialPostDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        _id={_id}
        name={name}
        handle={handle}
        userId={userId}
        time={time}
        isVerified={isVerified}
        content={content}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        imageUrl={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
        avatar={avatar}
        likesCount={localLikesCount}
        commentsCount={commentsCount}
        repostsCount={repostsCount}
        comments={comments}
      />
    </div>
  );
};