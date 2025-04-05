'use client';
import React, { useEffect, useState } from 'react';
import { MoreHorizontal, X, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { baseURL } from '@/service/app.api';
import CommentSection from '../comments/CommentSection';
import { CommentData } from '@/service/api.interface';
import ProfileAvatar from '../profile/ProfileAvatar';
import KebabMenu from '../post/KebabMenu';

interface PostCardProps {
  _id:string;
  name: string;
  handle: string;
  time: string;
  isVerified?: boolean;
  content: string;
  isLiked: boolean;
  imageUrl: string;
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
  content,
  imageUrl,
  isLiked,
  likesCount,
  commentsCount,
  avatar,
  repostsCount
}) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        if (isLiked) {
            setIsActive(true);
        }
    }, [isLiked]);

    const toggleComments = () => {
        setIsCommentsOpen(!isCommentsOpen);
        {!isCommentsOpen && getComments() } 
    };
    const handleLike = async () => {
        try {
            const response = await fetch(`/api/postAction/?post_id=${_id}&type=like`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to like post');
            }
            
            // Handle successful like
            console.log('Post liked successfully');
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

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
            const response = await fetch(`/api/postAction/?post_id=${_id}&type=comment`, {
                method: 'GET',
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
    <div className="border-b border-gray-300">
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
            <ProfileAvatar src={avatar} alt={name} size='xs' className='' />
          <div className="ml-2">
            <div className="flex items-center">
              <h4 className="font-semibold text-sm">{name}</h4>
              {/* <span className="text-xs text-gray-500 ml-1.5">• Following</span> */}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{handle}</span>
              <span className="mx-1.5">•</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
        <KebabMenu postId={_id} />
          {/* <button aria-label='remove-post-feed' className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <X size={16} className="text-gray-500" />
          </button> */}
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm mb-3">{content}</p>
        <div className="rounded-lg overflow-hidden bg-gray-50">
          <img src={imageUrl} alt="Post" className="w-full h-auto object-cover" />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
            <Heart size={10} color='white' className="text-white" />
          </div>
          <span className="ml-1.5">{likesCount}</span>
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
          { icon: <Heart size={18}  className={isLiked ? "text-accent font-bold" : "text-gray-500"} />, label: "Like", onClick: handleLike, isActive: isLiked },
          { icon: <MessageCircle size={18} className={isCommentsOpen ? "text-blue-500" : "text-gray-500"} />, label: "Comment", onClick: toggleComments, isActive: isCommentsOpen },
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
      <div className="p-2">
        <CommentSection 
          post_id={_id}
          isOpen={isCommentsOpen} 
          comments={comments}
        />
    </div>
    </div>
    
  );
};