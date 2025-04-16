'use client'
import { PostCard } from '@/components/feed/PostCard'
import { BOOKMARKS_TABS } from '@/lib/constants/index-constants'
import { cn } from '@/lib/utils'
import { formatSDGLink } from '@/lib/utilities/sdgLinkFormat'
import { PostBookmarkData, SDGArticleData, SDGVideoData } from '@/service/api.interface'
import { ArrowLeft } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import VideoCard from '@/components/video/VideoCard'

const Page = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [postBookmarks, setPostBookmarks] = useState<PostBookmarkData[]>([]);
    const [newsBookmarks, setNewsBookmarks] = useState<SDGArticleData[]>([]);
    const [videoBookmarks, setVideoBookmarks] = useState<SDGVideoData[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const [loadingNews, setLoadingNews] = useState<boolean>(false);
    const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Cache state to track which data we've already fetched
    const [hasFetchedPosts, setHasFetchedPosts] = useState<boolean>(false);
    const [hasFetchedNews, setHasFetchedNews] = useState<boolean>(false);
    const [hasFetchedVideos, setHasFetchedVideos] = useState<boolean>(false);

    // Get post bookmarks with caching
    const getPostBookmarks = useCallback(async () => {
        // Skip if we already have this data
        if (hasFetchedPosts && postBookmarks.length > 0) return;
        
        setError(null);
        setLoadingPosts(true);
        
        try {
            const response = await fetch('/api/post/bookmark');
            
            if (!response.ok) {
                throw new Error('Failed to fetch post bookmarks');
            }
            
            const data = await response.json();
            setPostBookmarks(data.data || []);
            setHasFetchedPosts(true);
        } catch (error) {
            console.error('Error fetching post bookmarks:', error);
            setError('Failed to load post bookmarks. Please try again later.');
        } finally {
            setLoadingPosts(false);
        }
    }, [hasFetchedPosts, postBookmarks.length]);

    // Get news bookmarks with caching
    const getNewsBookmarks = useCallback(async () => {
        // Skip if we already have this data
        if (hasFetchedNews && newsBookmarks.length > 0) return;
        
        setError(null);
        setLoadingNews(true);
        
        try {
            const response = await fetch('/api/sdgNews/bookmark');
            
            if (!response.ok) {
                throw new Error('Failed to fetch news bookmarks');
            }
            
            const data = await response.json();
            setNewsBookmarks(data.data || []);
            setHasFetchedNews(true);
        } catch (error) {
            console.error('Error fetching news bookmarks:', error);
            setError('Failed to load news bookmarks. Please try again later.');
        } finally {
            setLoadingNews(false);
        }
    }, [hasFetchedNews, newsBookmarks.length]);

    // Get video bookmarks with caching
    const getVideoBookmarks = useCallback(async () => {
        // Skip if we already have this data
        if (hasFetchedVideos && videoBookmarks.length > 0) return;
        
        setError(null);
        setLoadingVideos(true);
        
        try {
            const response = await fetch('/api/video/bookmark');
            
            if (!response.ok) {
                throw new Error('Failed to fetch video bookmarks');
            }
            
            const data = await response.json();
            setVideoBookmarks(data.data || []);
            setHasFetchedVideos(true);
        } catch (error) {
            console.error('Error fetching video bookmarks:', error);
            setError('Failed to load video bookmarks. Please try again later.');
        } finally {
            setLoadingVideos(false);
        }
    }, [hasFetchedVideos, videoBookmarks.length]);

    // Combined bookmarks for "All" tab
    const allBookmarks = useMemo(() => {
        const loading = loadingPosts || loadingNews || loadingVideos;
        const isEmpty = postBookmarks.length === 0 && newsBookmarks.length === 0 && videoBookmarks.length === 0;
        
        return { loading, isEmpty };
    }, [loadingPosts, loadingNews, loadingVideos, postBookmarks.length, newsBookmarks.length, videoBookmarks.length]);

    // Fetch data based on selected category
    useEffect(() => {
        if (selectedCategory === "All" || selectedCategory === "Posts") {
            getPostBookmarks();
        }
        
        if (selectedCategory === "All" || selectedCategory === "News") {
            getNewsBookmarks();
        }

        if (selectedCategory === "All" || selectedCategory === "Videos") {
            getVideoBookmarks();
        }
    }, [selectedCategory, getPostBookmarks, getNewsBookmarks, getVideoBookmarks]);

    // Handle tab change
    const handleTabChange = (category: string) => {
        setSelectedCategory(category);
    };

    // Render loading state
    const renderLoading = () => (
        <div className="flex justify-center items-center p-8">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Render error state
    const renderError = () => (
        <div className="flex justify-center items-center p-8 text-red-500">
            {error}
        </div>
    );

    // Render empty state
    const renderEmpty = () => (
        <div className="flex justify-center items-center p-8 text-gray-500">
            No bookmarks found
        </div>
    );
    
    return (
        <div className='flex flex-1 flex-col overflow-hidden'>
            <div className="sticky top-0 bg-white z-10 flex items-center p-3 border-b border-gray-200">
                <Link href="/" aria-label='back-button' className="mr-4">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-lg font-semibold flex-1">Bookmarks</h1>
            </div>

            <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
                {BOOKMARKS_TABS.map((category) => (
                    <button
                        key={category}
                        onClick={() => handleTabChange(category)}
                        className={cn(
                            "px-8 py-1 rounded-full cursor-pointer text-lg font-semibold whitespace-nowrap",
                            selectedCategory === category
                            ? "bg-accent text-white"
                            : "bg-white text-accent border border-accent"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {error && renderError()}

            {/* All Bookmarks Tab */}
            {selectedCategory === "All" && (
                <div className="flex flex-col gap-4 p-4">
                    {allBookmarks.loading ? (
                        renderLoading()
                    ) : allBookmarks.isEmpty ? (
                        renderEmpty()
                    ) : (
                        <>
                            {/* Post Bookmarks */}
                            {postBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold">Posts</h2>
                                    {postBookmarks.map((bookmark) => (
                                        <PostCard 
                                            key={bookmark._id}
                                            _id={bookmark._id}
                                            name={bookmark.user_id.name || bookmark.user_id.username}
                                            handle={bookmark.user_id.username}
                                            time={bookmark.createdAt}
                                            isVerified={bookmark.user_id.isFollowing || false}
                                            content={bookmark.content}
                                            isLiked={bookmark.isLiked}
                                            isBookmarked={bookmark.isBookmarked}
                                            imageUrl={bookmark.images}
                                            avatar={bookmark.user_id.profileImage || ''}
                                            likesCount={bookmark.poststat_id.likes}
                                            commentsCount={bookmark.poststat_id.comments}
                                            repostsCount={bookmark.poststat_id.reposts}
                                            userId={bookmark.user_id._id}
                                        />
                                    ))}
                                </>
                            )}

                            {/* News Bookmarks */}
                            {newsBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold mt-4">News</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {newsBookmarks.map((news) => (
                                            <div key={news._id} className="border rounded-lg p-4 shadow-sm">
                                                <h3 className="font-medium mb-2">{news.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{news.publisher}</p>
                                                <a 
                                                    href={formatSDGLink(news.link)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-accent text-sm hover:underline"
                                                >
                                                    Read article
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Video Bookmarks */}
                            {videoBookmarks.length > 0 && (
                                <>
                                    <h2 className="text-lg font-semibold mt-4">Videos</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {videoBookmarks.map((video) => (
                                            <VideoCard key={video._id} video={video} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Posts Tab */}
            {selectedCategory === "Posts" && (
                <div className="flex flex-col gap-4 p-4">
                    {loadingPosts ? (
                        renderLoading()
                    ) : postBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        postBookmarks.map((bookmark) => (
                            <PostCard 
                                key={bookmark._id}
                                _id={bookmark._id}
                                name={bookmark.user_id.name || bookmark.user_id.username}
                                handle={bookmark.user_id.username}
                                time={bookmark.createdAt}
                                isVerified={bookmark.user_id.isFollowing || false}
                                content={bookmark.content}
                                isLiked={bookmark.isLiked}
                                isBookmarked={bookmark.isBookmarked}
                                imageUrl={bookmark.images}
                                avatar={bookmark.user_id.profileImage || ''}
                                likesCount={bookmark.poststat_id.likes}
                                commentsCount={bookmark.poststat_id.comments}
                                repostsCount={bookmark.poststat_id.reposts}
                                userId={bookmark.user_id._id}
                            />
                        ))
                    )}
                </div>
            )}

            {/* News Tab */}
            {selectedCategory === "News" && (
                <div className="flex flex-col gap-4 p-4">
                    {loadingNews ? (
                        renderLoading()
                    ) : newsBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {newsBookmarks.map((news) => (
                                <div key={news._id} className="border rounded-lg p-4 shadow-sm">
                                    <h3 className="font-medium mb-2">{news.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{news.publisher}</p>
                                    <a 
                                        href={formatSDGLink(news.link)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-accent text-sm hover:underline"
                                    >
                                        Read article
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Videos Tab */}
            {selectedCategory === "Videos" && (
                <div className="flex flex-col gap-4 p-4">
                    {loadingVideos ? (
                        renderLoading()
                    ) : videoBookmarks.length === 0 ? (
                        renderEmpty()
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {videoBookmarks.map((video) => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Page;