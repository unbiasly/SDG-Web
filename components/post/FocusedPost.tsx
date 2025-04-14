import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { X, ThumbsUp, MessageSquare, Repeat2, Share, MessageCircle, Bookmark, Flag, MoreVertical, Pencil, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import CommentSection from "./CommentSection";
import PostMenu from "./PostMenu";
import ProfileAvatar from "../profile/ProfileAvatar";
import { CommentData } from "@/service/api.interface";
import { useUser } from '@/lib/redux/features/user/hooks';
import EditPost from './EditPost';
import ReportPopover from './ReportPopover';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
}

export function SocialPostDialog({ open, onOpenChange, avatar, name, handle, time, _id, isVerified, content, isLiked, imageUrl, likesCount, commentsCount, repostsCount, comments, isBookmarked, userId }: SocialPostDialogProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [isBookmarkActive, setIsBookmarkActive] = useState(isBookmarked);
  
  const { user } = useUser();
  const currentUserId = user?._id;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleReportClick = () => {
    setIsMenuOpen(false);
    setReportOpen(true);
  };
  
  const handleBookmark = async () => {
    try {
      const newBookmarkState = !isBookmarkActive;
      setIsBookmarkActive(newBookmarkState);
      
      const response = await fetch(`/api/post/post-action/?post_id=${_id}&type=bookmark`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        setIsBookmarkActive(!newBookmarkState);
        throw new Error('Failed to bookmark post');
      }
      
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
    { icon: <Bookmark className={`h-5 w-5 ${isBookmarkActive ? "fill-current text-accent" : "text-gray-500"}`} />, label: isBookmarked ? "Unsave post" : "Save post", onClick: handleBookmark },
    ...(userId === currentUserId ? [
      { icon: <Pencil className="h-5 w-5 text-gray-500" />, label: "Edit post", onClick: handleEditPost },
      { icon: <Trash className="h-5 w-5 text-gray-500" />, label: "Delete post", onClick: handleDeletePost },
    ] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-6xl rounded-lg h-[80vh] flex p-0">
        <DialogTitle className="sr-only">Social Media Post</DialogTitle>
        <DialogDescription className="sr-only">{content}</DialogDescription>
        
        {/* Left side - Image Carousel */}
        <div className="h-full w-2/3 rounded-lg border-r-2 bg-[#1E1E1E] flex items-center justify-center overflow-hidden relative">
            {imageUrl && imageUrl.length > 0 && (
                <Carousel className="w-full h-full flex justify-center items-center">
                    <CarouselContent className="h-full">
                        {Array.isArray(imageUrl) && imageUrl.map((url, index) => (
                            <CarouselItem key={index} >
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <Image 
                                        src={url}
                                        alt={`${content} ${index + 1}`}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full  h-full object-contain"
                                        // todo : fix the image sizing
                                        priority={index === 0}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        quality={100}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    
                    {imageUrl.length > 1 && (
                        <>
                            <CarouselPrevious className="absolute left-4 bg-black/50 border-none hover:bg-black/70 z-10" />
                            <CarouselNext className="absolute right-4 bg-black/50 border-none hover:bg-black/70 z-10" />
                            
                            {/* Image counter indicator */}
                            <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded-md text-white text-xs z-10">
                                {imageUrl.map((_, i) => (
                                    <span key={i} className="inline-block w-2 h-2 rounded-full mx-1 bg-white/50"></span>
                                ))}
                            </div>
                        </>
                    )}
                </Carousel>
            )}
        </div>
        
        {/* Right side - Content */}
        <div className="flex flex-col h-full w-1/3">
        
        {/* Header with profile info */}
        <div className="flex px-4 my-8 justify-between ">
            <div className="flex items-center">
                <ProfileAvatar src={avatar} alt={name} size='sm' className='' />
                <div className="ml-2">
                <div className="flex items-center">
                    <h4 className="font-semibold text-sm">{name}</h4>
                    {/* <span className="text-xs text-gray-500 ml-1.5">• Following</span> */}
                </div>
                <div className="flex flex-col justify-center text-xs text-gray-500">
                    <span>{handle}</span>
                    {/* <span className="mx-1.5">•</span> */}
                    <span>{time}</span>
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
                          <span className="text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
      </div>
        
        
        {/* Content area with scrolling */}
        <div className="overflow-y-auto flex-1">
            <div className="px-4">
            <h2 className=" text-lg font-medium mb-3">
                {content}
            </h2>
            
            {/* Engagement stats */}
            <div className="flex justify-between text-sm text-gray-500  mb-3">
                <div className="flex items-center">
                <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center mr-1">
                    <ThumbsUp size={12} color="white" />
                </div>
                <span>{likesCount}</span>
                </div>
                <div className="flex gap-4">
                <span>{commentsCount} comments</span>
                <span>{repostsCount} reposts</span>
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
                {[
                  { icon: <ThumbsUp size={16} />, label: "Like" },
                  { icon: <Repeat2 size={16} />, label: "Repost" },
                  { icon: <Share size={16} />, label: "Share" }
                ].map((action, index) => (
                  <button 
                    key={index}
                    aria-label={action.label}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-gray-600 text-sm"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
            </div>
            
            
            {/* Comments section */}
            <div className="space-y-4 pb-10">
                <CommentSection 
                    post_id={_id}
                    isOpen={true} 
                    comments={comments}
                />
            </div>
            </div>
        </div>
        </div>
        
        <ReportPopover open={reportOpen} onOpenChange={setReportOpen} postId={_id} />
        <EditPost 
          open={editPostOpen} 
          onOpenChange={setEditPostOpen} 
          postId={_id} 
          initialContent={content}
          images={Array.isArray(imageUrl) ? imageUrl : [imageUrl]}
        />
      </DialogContent>
    </Dialog>
  );
}