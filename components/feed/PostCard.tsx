'use client';
import React, { useEffect, useState } from 'react';
import { MoreHorizontal, X, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';
import { baseURL } from '@/service/app.api';
import CommentSection from '../comments/CommentSection';
import { CommentData } from '@/service/api.interface';

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
    <div className="post-card animate-fade-in">
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
            <Image
              src={avatar} 
              alt={name}
              width={100}
              height={100} 
              className="object-cover"
            />
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <h4 className="font-semibold text-sm">{name}</h4>
              <span className="text-xs text-gray-500 ml-1.5">• Following</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>{handle}</span>
              <span className="mx-1.5">•</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label='.' className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <MoreHorizontal size={16} className="text-gray-500" />
          </button>
          <button aria-label='.' className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <X size={16} className="text-gray-500" />
          </button>
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
            <Heart size={10} className="text-white" />
          </div>
          <span className="ml-1.5">{likesCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{commentsCount} comments</span>
          {/* <span>•</span>
          <span>{repostsCount} reposts</span> */}
        </div>
      </div>
      
      <div className="flex justify-between pt-2 border-t border-gray-100">
        {[
          { icon: <Heart size={18} className={isLiked ? "text-gray-500" : "text-gray-500"} />, label: "Like", onClick: handleLike, isActive: isLiked },
          { icon: <MessageCircle size={18} className={isCommentsOpen ? "text-blue-500" : "text-gray-500"} />, label: "Comment", onClick: toggleComments, isActive: isCommentsOpen },
          { icon: <Share2 size={18} className="text-gray-500" />, label: "Share", onClick: handleShare, isActive: false }
        ].map((action, index) => (
          <button 
            key={index}
            className={`w-50 flex items-center cursor-pointer justify-center gap-2 py-1.5 rounded-md transition-colors duration-200 ${action.isActive ? isLiked ? "font-bold bg-red-400 text-red-100" : "font-bold bg-gray-300" : "font-medium hover:bg-gray-200 "}`}
            onClick={action.onClick}
          >
            {action.icon}
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>
      <div className="px-2 py-3">
        <CommentSection 
          post_id={_id}
          isOpen={isCommentsOpen} 
          comments={comments}
        />
    </div>
    </div>
    
  );
};