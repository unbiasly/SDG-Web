"use client"

import { useState } from "react";
import { Bookmark, PlayCircle, PauseCircle, X, Volume2, Video } from "lucide-react";
import YouTube from "react-youtube";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    saved?: boolean;
    comments?: number;
    views?: number;
    likes?: number;
};
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
//   const [isBookmarked, setIsBookmarked] = useState(video.isBookmarked || false);


  
  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  const handleVideoClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(false);
  };
  
//   const handleBookmarkToggle = async () => {
//     try {
//       const actionType = isBookmarked ? 'unbookmark' : 'bookmark';
      
//       const response = await fetch(`/api/video/${video._id}/${actionType}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
      
//       if (response.ok) {
//         setIsBookmarked(!isBookmarked);
//       }
//     } catch (error) {
//       console.error("Error toggling bookmark:", error);
//     }
//   };
  
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
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center p-4 space-x-3">
        <div className="h-10 w-10 bg-gray-700 rounded flex items-center justify-center">
          {isPodcast ? (
            <Volume2 className="h-5 w-5 text-white" />
          ) : (
            <Video className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
        </div>
        {/* <button 
          aria-label={isBookmarked ? "unbookmark" : "bookmark"} 
          className={cn(
            "hover:text-blue-600 transition-colors",
            isBookmarked ? "text-blue-600" : "text-gray-400" 
          )}
          onClick={handleBookmarkToggle}
        >
          <Bookmark className="h-5 w-5" />
        </button> */}
      </div>
      
      <div className="rounded-lg px-5 relative aspect-video">
        {isPlaying ? (
          <div className="relative w-full h-full">
            <YouTube
              videoId={video.video_id}
              opts={opts}
              className="w-full h-full"
              onEnd={() => setIsPlaying(false)}
            />
            <button 
              onClick={handleVideoClose}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div 
            className="relative cursor-pointer group w-full h-full"
            onClick={handlePlayClick}
          >
            <img 
              src={video.thumbnail_url} 
              alt={video.title}
              className="w-full h-full aspect-video rounded object-cover"
            />
            <div className={cn(
              "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
              isPodcast ? "bg-blue-900/30" : "bg-white/20"
            )}>
              {isPodcast ? (
                <div className="bg-white/20 p-4 rounded-full">
                  <Volume2 className="h-12 w-12 text-white" />
                </div>
              ) : (
                <PlayCircle className="h-16 w-16 text-black" />
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {video.description && (
          <p className="text-sm text-gray-800 mb-4 line-clamp-2">{video.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <span className={cn(
              "px-2 py-1 rounded-full text-white",
              isPodcast ? "bg-blue-600" : "bg-red-600"
            )}>
              {isPodcast ? "Podcast" : "Talk"}
            </span>
            <span className="mx-2">•</span>
            <span>{video.channel_name}</span>
          </div>
          {formattedDate && <span>{formattedDate}</span>}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;