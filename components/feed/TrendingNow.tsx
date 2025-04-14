'use client'
import { formatDate } from '@/lib/utilities/formatDate';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Article } from './SDGNews';
import { formatSDGLink } from '@/lib/utilities/sdgLinkFormat';
import { ScrollArea } from '../ui/scroll-area';

interface TrendingItemProps {
    _id: string;
  title: string;
  publisher: string;
  link: string;
  updatedAt: string;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ _id, title, publisher, link }) => {
  return (
    <div className=' rounded-xs mb-2 shadow-sm   p-1'>
        <Link key={_id} href={link} target='_blank' className="mb-2">
        <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
            <span className='text-xs text-gray-500'>{publisher}</span>
        {/* <div className="flex items-center text-xs text-gray-500">
            <span className="mx-1.5">•</span>
            <span>{formatDate(updatedAt)}</span>
            </div> */}
        </Link>
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