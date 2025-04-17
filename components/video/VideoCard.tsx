"use client"

import { useState } from "react";
import { Bookmark, PlayCircle, PauseCircle, X, Volume2, Video, ExternalLink, Share2, MoreVertical, CirclePlay, Play } from "lucide-react";
import YouTube from "react-youtube";
import { formatDistanceToNow, set } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

interface Goal {
    _id: string;
    name: string;
}

interface Goal {
    _id: string;
    name: string;
}

interface VideoCardProps {
    video: {
        _id: string;
        title: string;
        thumbnail_url: string;
        description?: string;
        type: string;
        channel_name: string;
        video_id: string;
        link: string;
        published_date: string;
        createdAt: string;
        updatedAt: string;
        status?: string;
        goal_id?: Goal[];
        isBookmarked?: boolean;
        comments?: number;
        views?: number;
        likes?: number;
    };
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isBookmarked = video.isBookmarked;
  const [isActive, setIsActive] = useState(isBookmarked);
  
  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  const handleVideoClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
  };
  
  const handleBookmarkToggle = async () => {
    try {
      const response = await fetch(`/api/video`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId: video._id,
          actionType: 'bookmark',
        }),
      });
      
      if (response.ok) {
        setIsActive(!isActive);
        // TODO: Consistently set the IsBookmarked state
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description || '',
        url: video.link,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(video.link);
      // Could add a toast notification here
    }
  };
  
  
  const formattedDate = video.published_date
    ? formatDistanceToNow(new Date(video.published_date), { addSuffix: true })
    : '';
    
  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  // Determine if this is a podcast
  const isPodcast = video.type === "podcast";

  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center p-3 space-x-3">
        <Image
            src={'/placeholder.png'}
            alt={video?.title || ""}
            width={0}
            height={0}
            sizes='100vw'
            objectFit='cover'
            className="rounded-full w-10 h-10"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold line-clamp-2 leading-tight">{video.title}</h3>
        </div>
        <button 
          aria-label={isActive ? "unbookmark" : "bookmark"} 
          className="hover:text-blue-600 transition-colors cursor-pointer rounded-full p-1"
          onClick={handleBookmarkToggle}
        >
          <Bookmark className={cn(
            "h-5 w-5",
            isActive ? "fill-current " : "text-gray-400"
          )} />
        </button>
      </div>
      
      {/* Modified image container with reduced height but contained image */}
      <div className="relative h-full">
        {isPlaying ? (
          <div className="relative w-full h-full aspect-video overflow-hidden">
            <YouTube
              videoId={video.video_id}
              opts={opts}
              className="w-full h-full"
              onEnd={() => setIsPlaying(false)}
            />
            <button 
              onClick={handleVideoClose}
              className="absolute cursor-pointer top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
              aria-label="Close video"
            >
              <X className="h-5 w-5" color="white"/>
            </button>
          </div>
        ) : (
          <div 
            className="cursor-pointer w-full h-full overflow-hidden aspect-video flex items-center justify-center"
          >
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="max-h-full max-w-full object-cover aspect-video"
            />
          </div>
        )}
      </div>
      
      <div className="py-2 px-3">
        {video.description && (
          <p className="text-sm text-gray-800 mb-2 line-clamp-2">{video.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className={cn(
              " rounded-full text-black",
            )}>
              {isPodcast ? "Episode" : "SDG Talk"}
            </span>
            <span className="mx-2">•</span>
            <span>{video.channel_name}</span>
          </div>
          {/* {formattedDate && <span>{formattedDate}</span>} */}
        </div>
        
        {/* Hover Actions Panel - Positioned below content */}
        {isHovered && !isPlaying && (
          <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in">

            <div className="flex justify-between">
                <button 
                    onClick={handlePlayClick}
                    className="text-white font-semibold flex items-center gap-2 py-2 px-4 bg-zinc-400 cursor-pointer  rounded-lg transition-colors"
                    aria-label="Play video"
                    >
                        <Play color="white" className="fill-white" />
                        <span>Preview</span>
                    </button>
                <div className="flex">
                {/* <button 
                    onClick={handleOpenExternal}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open in new tab"
                >
                    <MoreVertical className="h-5 w-5 text-gray-700" />
                </button> */}
                <Link href={`/videos/${video._id}`} 
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Open in new tab"
                >
                    <CirclePlay className=" h-5 w-5 text-gray-700" />
                </Link>
                
                </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;