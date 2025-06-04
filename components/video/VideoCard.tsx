"use client";

import { useState, useRef, useEffect } from "react";
import {
    Bookmark,
    X,
    Volume2,
    Share2,
    CirclePlay,
    Play,
    Flag,
} from "lucide-react";
import YouTube from "react-youtube";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import ReportPopover from "../post/ReportPopover";
import ShareContent from "../post/ShareContent";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-media-query";
import Options from "../custom-ui/Options";

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
    playingVideoId: string | null; // ID of the currently playing video
    setPlayingVideoId: (id: string | null) => void; // Function to update playing video
    onBookmarkToggle?: () => void; // Add this prop
}

const VideoCard = ({
    video,
    playingVideoId,
    setPlayingVideoId,
    onBookmarkToggle,
}: VideoCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const isBookmarked = video.isBookmarked;
    const [isActive, setIsActive] = useState(isBookmarked);
    const queryClient = useQueryClient();
    const playerRef = useRef<any>(null);

    // Use the useMediaQuery hook to detect mobile screens
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Add state for report popover
    const [reportOpen, setReportOpen] = useState(false);
    // Add state for share dialog
    const [shareOpen, setShareOpen] = useState(false);

    // Determine if this video is currently playing
    const isPlaying = playingVideoId === video._id;

    const handlePlayClick = () => {
        // Set this video as the playing video, which will close any other playing videos
        setPlayingVideoId(video._id);
    };

    const handleVideoClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Stop all videos from playing
        setPlayingVideoId(null);
    };

    // Handle when YouTube player is ready
    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;

        // For mobile devices, try to play immediately when ready
        if (isMobile) {
            try {
                // Small delay to ensure player is fully loaded
                setTimeout(() => {
                    event.target.playVideo();
                }, 100);
            } catch (error) {
                console.log("Autoplay failed on mobile:", error);
            }
        }
    };

    // Handle player state changes
    const onPlayerStateChange = (event: any) => {
        // YouTube player states:
        // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)

        if (event.data === 0) {
            // Video ended
            setPlayingVideoId(null);
        }

        // If video is cued (state 5) on mobile, try to play it
        if (event.data === 5 && isMobile) {
            try {
                setTimeout(() => {
                    event.target.playVideo();
                }, 200);
            } catch (error) {
                console.log("Failed to start playback:", error);
            }
        }
    };

    // Enhanced YouTube player options for mobile compatibility
    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 1,
            mute: isMobile ? 1 : 0, // Mute on mobile to allow autoplay
            playsinline: 1, // Essential for iOS
            controls: 1,
            rel: 0, // Don't show related videos
            showinfo: 0,
            fs: 1, // Allow fullscreen
            cc_load_policy: 0, // Don't show captions by default
            iv_load_policy: 3, // Don't show annotations
            modestbranding: 1, // Minimal YouTube branding
            // Mobile-specific parameters
            ...(isMobile && {
                enablejsapi: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : '',
            }),
        },
    };

    // Menu toggle functions
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

    const handleBookmarkToggle = async () => {
        try {
            const response = await fetch(`/api/video`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    videoId: video._id,
                    actionType: "bookmark",
                }),
            });

            if (response.ok) {
                setIsActive(!isActive);

                // Call the callback if provided and unbookmarking
                if (isActive && onBookmarkToggle) {
                    onBookmarkToggle();
                }

                // Fix: Invalidate with the correct query key pattern
                queryClient.invalidateQueries({
                    queryKey: ["sdgVideos"],
                    exact: false,
                });
    
            // Method 2: Force refetch immediately
                queryClient.refetchQueries({
                    queryKey: ["sdgVideos"],
                    exact: false,
                });
                
                // Method 3: Update cache directly for immediate UI feedback
                queryClient.setQueriesData({ 
                    queryKey: ["sdgVideos"],
                    exact: false
                    },
                    (oldData: any) => {
                        if (!oldData) return oldData;
                        
                        return {
                            ...oldData,
                            pages: oldData.pages.map((page: any) => ({
                                ...page,
                                data: page.data.map((v: any) => 
                                    v._id === video._id 
                                        ? { ...v, isBookmarked: !v.isBookmarked }
                                        : v
                                )
                            }))
                        };
                    }
                );
                
                // Also invalidate bookmarked videos
                queryClient.invalidateQueries({ 
                    queryKey: ["bookmarkedVideos"],
                    exact: false 
                });

                // Show success toast
                toast.success(
                    isActive
                        ? "Video removed from bookmarks"
                        : "Video added to bookmarks"
                );
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Failed to update bookmarks");
        }
    };

    const handleShare = () => {
        closeMenu(); // Close the menu first
        setShareOpen(true); // Open the ShareContent dialog
    };

    const handleReport = () => {
        closeMenu();
        setReportOpen(true);
    };

    // Handle report submission completion
    const handleReportSubmitted = () => {
        toast.success("Thank you for your report");

        // Fix: Invalidate with the correct query key pattern
        queryClient.invalidateQueries({ 
            queryKey: ["sdgVideos"],
            exact: false 
        });
    };

    const formattedDate = video.published_date
        ? formatDistanceToNow(new Date(video.published_date), {
            addSuffix: true,
        })
        : "";

    const menuOptions = [
        {
            icon: <Share2 className="h-5 w-5 text-gray-500" />,
            label: "Share",
            onClick: handleShare,
        },
        {
            icon: <Flag className="h-5 w-5 text-gray-500" />,
            label: "Report",
            onClick: handleReport,
        },
    ];

    return (
        <div
            className="border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center p-3 space-x-3">
                <Image
                    src={"/placeholder.png"}
                    alt={video?.title || ""}
                    width={0}
                    height={0}
                    sizes="100vw"
                    objectFit="cover"
                    className="rounded-full w-10 h-10"
                />
                <div className="flex-1">
                    <h3 className="text-xl font-bold line-clamp-2 leading-tight">
                        {video.title}
                    </h3>
                </div>
                <button
                    aria-label={isActive ? "unbookmark" : "bookmark"}
                    className="hover:text-blue-600 transition-colors cursor-pointer rounded-full p-1"
                    onClick={handleBookmarkToggle}
                >
                    <Bookmark
                        className={cn(
                            "h-5 w-5",
                            isActive ? "fill-current " : "text-gray-400"
                        )}
                    />
                </button>
            </div>

            <div className="relative h-full">
                {isPlaying ? (
                    <div className="relative w-full h-full aspect-video overflow-hidden">
                        <YouTube
                            videoId={video.video_id}
                            opts={opts}
                            className="w-full h-full"
                            onReady={onPlayerReady}
                            onStateChange={onPlayerStateChange}
                            onEnd={() => setPlayingVideoId(null)}
                        />
                        <button
                            onClick={handleVideoClose}
                            className="absolute cursor-pointer top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
                            aria-label="Close video"
                        >
                            <X className="h-5 w-5" color="white" />
                        </button>

                        {/* Mobile-specific unmute button */}
                        {isMobile && (
                            <button
                                onClick={() => {
                                    if (playerRef.current) {
                                        if (playerRef.current.isMuted()) {
                                            playerRef.current.unMute();
                                        } else {
                                            playerRef.current.mute();
                                        }
                                    }
                                }}
                                className="absolute cursor-pointer top-2 left-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 z-10"
                                aria-label="Toggle sound"
                            >
                                <Volume2 className="h-5 w-5" color="white" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="cursor-pointer w-full h-full overflow-hidden aspect-video flex items-center justify-center">
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
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                        {video.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                        <span className={cn(" rounded-full text-black")}>
                            {video.type === "podcast" ? "Episode" : "SDG Talk"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{video.channel_name}</span>
                    </div>
                </div>

                <div
                    className={cn(
                        " transition-all duration-300",
                        isHovered
                            ? "max-h-24 mt-3 pt-3 border-t border-gray-200"
                            : "max-h-0"
                    )}
                >
                    <div className={`justify-between items-center ${isHovered ? "flex" : "hidden"}`}>
                        <button
                            onClick={handlePlayClick}
                            className="text-white font-semibold flex items-center gap-2 py-2 px-4 bg-zinc-400 cursor-pointer rounded-lg transition-colors"
                            aria-label="Play video"
                        >
                            <Play color="white" className="fill-white" />
                            <span>Preview</span>
                        </button>
                        <div className="flex items-center">
                            <Options menuOptions={menuOptions} position="above" isHovered={isHovered} />
                            <Link
                                href={`/videos/${video._id}`}
                                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Open in new tab"
                            >
                                <CirclePlay className="h-5 w-5 text-gray-700" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add ReportPopover component */}
            <ReportPopover
                open={reportOpen}
                onOpenChange={setReportOpen}
                id={video._id}
                type="video"
                onReportSubmitted={handleReportSubmitted}
            />

            {/* Add ShareContent component */}
            <ShareContent
                open={shareOpen}
                onOpenChange={setShareOpen}
                contentUrl={`/videos/${video._id}`}
                itemId={video._id}
            />
        </div>
    );
};

export default VideoCard;
