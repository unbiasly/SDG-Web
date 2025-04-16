'use client'
import { formatDate } from '@/lib/utilities/formatDate';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Article } from './SDGNews';
import { formatSDGLink } from '@/lib/utilities/sdgLinkFormat';
import { ScrollArea } from '../ui/scroll-area';
import { Bookmark, Flag, MoreVertical, ThumbsDown, ThumbsUp } from 'lucide-react';

interface TrendingItemProps {
  _id: string;
  title: string;
  publisher: string;
  link: string;
  updatedAt: string;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ _id, title, publisher, link }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // const menuOptions = [
    // //     { icon: <ThumbsUp className="h-5 w-5 text-gray-500" />, label: "Like post", onClick: handleLike },
    // //     { icon: <ThumbsDown className="h-5 w-5 text-gray-500" />, label: "Dislike post", onClick: handleDislike },
    //     { icon: <Flag className="h-5 w-5 text-gray-500" />, label: "Report post", onClick: handleReportClick },
        
    //     // ] : []),
    //   ];


    const handleBookmark = async () => {
        try {
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
                throw new Error('Failed to bookmark article');
            }

            const data = await response.json();
            setIsBookmarked(!isBookmarked);
            console.log('Article bookmarked:', data);
        } catch (error) {
            console.error('Error bookmarking article:', error);
        }
    }



  return (
    <div className=' rounded-sm mb-2 shadow-sm  border p-2'>
        <Link key={_id} href={link} target='_blank' className="mb-2">
        <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
            <span className='text-xs text-gray-500'>{publisher}</span>
        {/* <div className="flex items-center text-xs text-gray-500">
            <span className="mx-1.5">•</span>
            <span>{formatDate(updatedAt)}</span>
            </div> */}
        </Link>
        <div className="flex justify-between items-center mt-2" onClick={(e) => e.stopPropagation()}>
            <button aria-label="bookmark" className="rounded-full hover:bg-gray-200 cursor-pointer p-1" onClick={handleBookmark}>
              <Bookmark size={15} className={`${isBookmarked ? "fill-current text-accent" : "text-gray-500"}`} />
            </button>
            {/* <button aria-label="more_options" className="rounded-full hover:bg-gray-200 cursor-pointer p-1" onClick={toggleMenu}>
              <MoreVertical size={15} />
            </button> */}
            {/* {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg z-50 border border-gray-100 overflow-hidden"
              >
                <div className="py-1">
                  {menuOptions.map((item, index) => (
                    <button 
                      key={index}
                      className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                      onClick={item.onClick}
                    >
                      {item.icon}
                      <span className="text-gray-700">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )} */}
          </div>
    </div>
  );
};

export const TrendingSection: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const News = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/sdgNews');
            
            if (!response.ok) {
                throw new Error('Failed to fetch SDG news');
            }
            
            const data = await response.json();
            setArticles(data.data || []);
        } catch (error) {
            console.error('Error fetching SDG news:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        News();
    }, []);

    if (isLoading) {
        return (
            <div className="w-64 bg-white p-3 rounded-2xl border border-gray-300">
                <div className="h-6 w-32 bg-gray-200 rounded-2xl mb-1 animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
                
                <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
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
                    />
                ))}
            </ScrollArea>
        </div>
    );
};