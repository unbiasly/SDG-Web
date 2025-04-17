'use client'
import { useUser } from '@/lib/redux/features/user/hooks';
import { SDGVideoData } from '@/service/api.interface';
import React, { useEffect, useState } from 'react'
import ProfileAvatar from '../profile/ProfileAvatar';
import { Bookmark, MoreHorizontal, PlayCircle, Share2, ThumbsUp, X } from 'lucide-react';
import { Button } from '../ui/button';
import YouTube from 'react-youtube';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { da } from 'date-fns/locale';

const VideoPageClient = ({ videoId }: { videoId: string }) => {
    const { user } = useUser();
    const [data, setData] = useState<SDGVideoData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(data?.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(data?.isBookmarked);
    const [likesCount, setLikesCount] = useState(0);
    
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    const fetchVideoById = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/video/single', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                userId: user?._id,
                videoId: videoId,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to fetch videos');
            }
          
            const result = await response.json();
            setData(result.data);
            // Initialize state based on fetched data
            setIsLiked(result.data?.isLiked || false);
            setIsBookmarked(result.data?.isBookmarked || false);
            setLikesCount(result.data?.likes || 0);
        } catch (error) {
            console.error("Error fetching video:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleBookmarkToggle = async () => {
        try {
          const response = await fetch(`/api/video`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoId: videoId,
              actionType: 'bookmark',
            }),
          });
          
          if (response.ok) {
            // Optimistically update UI immediately
            setIsBookmarked(prevState => !prevState);
            
            // Update the data state to keep everything in sync
            setData(prevData => prevData ? {
              ...prevData,
              isBookmarked: !prevData.isBookmarked
            } : null);
          }
        } catch (error) {
          console.error("Error toggling bookmark:", error);
        }
      };

      const handleLikeToggle = async () => {
        try {
          const response = await fetch(`/api/video`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              videoId: videoId,
              actionType: 'like',
            }),
          });
          
          if (response.ok) {
            // Optimistically update UI immediately
            setIsLiked(prevState => !prevState);
            
            // Update likes count based on the action
            setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
            
            // Update the data state to keep everything in sync
            setData(prevData => {
              if (!prevData) return null;
              
              return {
                ...prevData,
                isLiked: !prevData.isLiked,
                likes: prevData.isLiked ? (prevData.likes || 1) - 1 : (prevData.likes || 0) + 1
              };
            });
          }
        } catch (error) {
          console.error("Error toggling like:", error);
        }
      };

    const handleVideoClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPlaying(false);
      };
    const handlePlayClick = () => {
        setIsPlaying(true);
    };

    useEffect(() => {
        if (videoId) {
            fetchVideoById();
        }
    }, [videoId, user?._id]);

    // Early rendering state for loading
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="animate-pulse text-xl">Loading video content...</div>
            </div>
        );
    }

    // Render consistent UI only after data is loaded
    return (
        <div className="flex-col m-auto px-4 py-6 flex gap-4">
            {/* Video Player */}
            <div className="aspect-video w-full bg-blue-500 rounded-lg overflow-hidden mb-4">
                {isPlaying ? (
                <div className="relative w-full h-full aspect-video overflow-hidden">
                    <YouTube
                        videoId={data?.video_id}
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
                    className="relative cursor-pointer w-full h-full overflow-hidden aspect-video flex items-center justify-center"
                    onClick={handlePlayClick}
                >
                    <img 
                    src={data?.thumbnail_url} 
                    alt={data?.title}
                    className="w-full "
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                        <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                </div>
                )}
            </div>
            {/* Main Content */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-5">
                    {/* Video Info */}
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <Image
                                src={'/placeholder.png'}
                                alt={data?.title || ""}
                                width={0}
                                height={0}
                                sizes='100vw'
                                objectFit='cover'
                                className="rounded-full w-20 h-20"
                            />
                            <div className="flex flex-col h-full w-2">
                                <div className="flex-1 bg-[#E5243B]"/>
                                <div className="flex-1 bg-[#DDA63A]"/>
                                <div className="flex-1 bg-[#4C9F38]"/>
                                <div className="flex-1 bg-[#C5192D]"/>
                                <div className="flex-1 bg-[#FF3A21]"/>
                                <div className="flex-1 bg-[#26BDE2]"/>
                                <div className="flex-1 bg-[#FCC30B]"/>
                                <div className="flex-1 bg-[#A21942]"/>
                                <div className="flex-1 bg-[#FD6925]"/>
                                <div className="flex-1 bg-[#DD1367]"/>
                                <div className="flex-1 bg-[#FD9D24]"/>
                                <div className="flex-1 bg-[#BF8B2E]"/>
                                <div className="flex-1 bg-[#3F7E44]"/>
                                <div className="flex-1 bg-[#0A97D9]"/>
                                <div className="flex-1 bg-[#56C02B]"/>
                                <div className="flex-1 bg-[#00689D]"/>
                                <div className="flex-1 bg-[#19486A]"/>
                            </div>
                            <h2 className="text-2xl font-semibold">{data?.title || "Video Title"}</h2>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-md text-gray-600">{data?.views} views</span>
                            <span className="text-md text-gray-600">
                                {data?.published_date 
                                    ? `${Math.floor((Date.now() - new Date(data.published_date).getTime()) / (1000 * 60 * 60 * 24))} days ago`
                                    : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {[
                                { 
                                    icon: <ThumbsUp className={cn("w-5 h-5", isLiked ? "fill-current text-blue-500" : "text-gray-400")} />,
                                    text: likesCount.toString(),
                                    onClick: handleLikeToggle 
                                },
                                { 
                                    icon: <Bookmark className={cn("w-5 h-5", isBookmarked ? "fill-current text-blue-500" : "fill-none")} />,
                                    text: isBookmarked ? "Saved" : "Save",
                                    onClick: handleBookmarkToggle 
                                },
                                { 
                                    icon: <Share2 className="w-5 h-5" />,
                                    text: "Share",
                                    onClick: () => {} 
                                }
                            ].map((item, index) => (
                                <Button key={index} variant="ghost" className="flex items-center p-0 gap-2" onClick={item.onClick}>
                                    {item.icon}
                                    <span className="text-lg font-semibold">{item.text}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-2 border rounded-lg border-gray-400">
                    <p className="text-lg text-gray-700 mb-8">
                        {data?.description || "No description available"}
                    </p>
                </div>

                {/* Comments Section */}
                <div className="mb-8 py-2 px-4 border rounded-lg border-gray-400">
                    <h3 className="text-lg font-semibold mb-4">Comments</h3>
                    <div className="flex gap-4 mb-6">
                        <ProfileAvatar src={user?.profileImage || ''} size="xs"/>
                        <input
                            type="text"
                            placeholder="Leave a comment..."
                            className="flex-1 bg-transparent border px-4 border-gray-300 focus:outline-none focus:border-accent rounded-full"
                        />
                    </div>

                    {/* Comments */}
                    {/* {(dx */}
                </div>
            </div>
        </div>
    );
};

export default VideoPageClient;

