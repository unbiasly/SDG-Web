import React from 'react';
import { MoreHorizontal, X, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';

interface PostCardProps {
  name: string;
  handle: string;
  time: string;
  isVerified?: boolean;
  content: string;
  imageUrl: string;
  avatar: string;
  likesCount: string;
  commentsCount: string;
  repostsCount: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  name,
  handle,
  time,
  isVerified = false,
  content,
  imageUrl,
  likesCount,
  commentsCount,
  avatar,
  repostsCount
}) => {
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
          <span>•</span>
          <span>{repostsCount} reposts</span>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
          <Heart size={18} />
          <span className="text-sm">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
          <MessageCircle size={18} />
          <span className="text-sm">Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md transition-colors duration-200">
          <Share2 size={18} />
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};