'use client'
import { PostCard } from '@/components/feed/PostCard'
import { BOOKMARKS_TABS } from '@/lib/constants/index-constants'
import { cn } from '@/lib/utils'
import { BookmarkData } from '@/service/api.interface'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const getBookmarks = async () => {
        setError(null);
        
        try {
            const response = await fetch('/api/post/bookmark');
            
            // if (!response.ok) {
            //     throw new Error('Failed to fetch bookmarks');
            // }
            
            const data = await response.json();
            setBookmarks(data.data ||    []);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setError('Failed to load bookmarks. Please try again later.');
        } 
    };

    useEffect(() => {
        getBookmarks();
    }, []);
    
  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
        <div className="sticky top-0 bg-white z-10 flex items-center p-3 border-b border-gray-200">
            <button aria-label='back-button' className="mr-4">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold flex-1">Bookmarks</h1>
        </div>

        <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
            {BOOKMARKS_TABS.map((category) => (
                <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                    "px-8 py-1 rounded-full cursor-pointer text-lg font-semibold whitespace-nowrap",
                    selectedCategory === category
                    ? "bg-accent text-white"
                    : "bg-white text-accent  border border-accent"
                )}
                >
                {category}
                </button>
            ))}
        </div>
        <div className="flex flex-col gap-4">
            {bookmarks && bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
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
            ) : (
                <div className="flex justify-center items-center p-8 text-gray-500">
                    No bookmarks found
                </div>
            )}
        </div>
        </div>

  )
}

export default Page