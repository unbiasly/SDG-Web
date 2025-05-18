'use client'
import { formatDate } from '@/lib/utilities/formatDate';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Article } from './SDGNews';
import { formatSDGLink } from '@/lib/utilities/sdgLinkFormat';
import { ScrollArea } from '../ui/scroll-area';
import { Bookmark, Flag, MoreVertical, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useUser } from '@/lib/redux/features/user/hooks';

interface TrendingItemProps {
  _id: string;
  title: string;
  publisher: string;
  link: string;
  updatedAt: string;
  isBookmarked?: boolean;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ _id, title, publisher, link, isBookmarked }) => {
    const [isActive, setIsActive] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBookmarkedActive, setIsBookmarkedActive] = useState(isBookmarked);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleBookmark = async () => {
        try {
            // Update local state immediately for a seamless experience
            setIsBookmarkedActive(!isBookmarkedActive);
            
            // Then make the API call
            const response = await fetch('/api/sdgNews', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newsId: _id,
                    actionType: 'bookmark',
                }),
            });

            if (!response.ok) {
                // If API call fails, revert to original state
                setIsBookmarkedActive(isBookmarkedActive);
                throw new Error('Failed to bookmark article');
            }

            const data = await response.json();
            console.log('Article bookmarked:', data);
        } catch (error) {
            console.error('Error bookmarking article:', error);
            // Optional: Show error toast here
        }
    }

    return (
        <div className=' rounded-sm mb-2 shadow-sm border p-2'>
            <Link key={_id} href={link} target='_blank' className="mb-2">
                <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
                <span className='text-xs text-gray-500'>{publisher}</span>
            </Link>
            <div className="flex justify-between items-center mt-2" onClick={(e) => e.stopPropagation()}>
                <button 
                    aria-label={isBookmarkedActive ? "remove bookmark" : "bookmark"} 
                    className="rounded-full hover:bg-gray-200 cursor-pointer p-1" 
                    onClick={handleBookmark}
                >
                    <Bookmark 
                        size={15} 
                        className={`${isBookmarkedActive ? "fill-current text-accent" : "text-gray-500"}`} 
                    />
                </button>
            </div>
        </div>
    );
};

export const TrendingSection: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useUser();
    const News = async () => {
        try {
            
            setIsLoading(true);
            const response = await fetch('/api/sdgNews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?._id,
                }),

            }
            );
            
            // if (!response.ok) {
            //     throw new Error('Failed to fetch SDG news');
            // }
            
            const data = await response.json();
            console.log('Fetched SDG news:', data);
            setArticles(data.data || []);
        } catch (error) {
            console.error('Error fetching SDG news:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            News();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="w-64 bg-white p-3 rounded-2xl border border-gray-300">
                <div className="h-6 w-32 bg-gray-200 rounded-2xl mb-1 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
                
                <div className="space-y-4">
                    {[...Array(7)].map((_, index) => (
                        <div key={index} className="rounded-2xl p-1">
                            <div className="h-10 bg-gray-200 rounded-2xl mb-1 animate-pulse"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded-2xl animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-64 bg-white p-3 rounded-2xl border border-gray-300 animate-fade-in">
            <h3 className="text-xl text-accent font-semibold mb-1">SDG News</h3>
            <p className="text-sm text-gray-500 mb-4">@TheSDG story</p>
            
            <ScrollArea className="h-[800px]">
                {articles.map((article) => (
                    <TrendingItem 
                        key={article._id}
                        _id={article._id}
                        title={article.title}
                        publisher={article.publisher}
                        link={formatSDGLink(article.link)}
                        updatedAt={article.updatedAt}
                        isBookmarked={article.isBookmarked}
                    />
                ))}
            </ScrollArea>
        </div>
    );
};