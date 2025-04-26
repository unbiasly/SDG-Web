'use client'
import { SEARCH_RESULT_CATEGORIES } from '@/lib/constants/index-constants';
import React, { useEffect, useState } from 'react'
import { Article, ArticleCard } from '../feed/SDGNews';
import PersonCard, { User } from '../profile/PersonCard';
import { ArrowLeft, Search } from 'lucide-react';
import { Post, SearchResultResponse, SDGVideoData } from '@/service/api.interface';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SearchPageClient = ({ q }: { q: string }) => {
    const [searchQuery, setSearchQuery] = useState(q);
    const [activeTab, setActiveTab] = useState(SEARCH_RESULT_CATEGORIES[0]);

    const [searchResults, setSearchResults] = useState<SearchResultResponse | null>(null);
    console.log("Search results:", searchResults);
    
    // Extract all data types from search results
    const users = searchResults?.data?.users || [];
    const articles = searchResults?.data?.news || [];
    const posts = searchResults?.data?.posts || [];
    const videos = searchResults?.data?.video || [];


    useEffect(() => {
        // Fetch search results when the component mounts or when the search query changes
        if (q) {
            setSearchQuery(q);
            getSearchResults(q);
        }
    }, [q]);

    const getSearchResults = async (query: string) => {
        try {
            const response = await fetch(`/api/search?q=${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log("Search results:", data);
            setSearchResults(data); // Store the search results
        }
        catch (error) {
            console.error("Error fetching search results:", error);
        }
    }

    const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>)  => {
        if (event.key === 'Enter') {
          const query = event.currentTarget.value;
          // Handle search submission
            console.log("Search submitted:", query);
    
            if (query) {
                const response = await fetch(`/api/search?q=${query}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const data = await response.json();
                setSearchResults(data); // Store the search results
                console.log("Search results:", data);
        }
      }
    }

    
    // Mock follow mutation object
    const followMutation = {
      isPending: false,
      variables: undefined
    };
    
    // Handler for follow/unfollow toggle
    const handleFollowToggle = (user: User) => {
      console.log(`Toggle follow for user: ${user.name}`);
      // In a real app, you would update the user's following status here
    };

    // Handler for rendering video items
    const renderVideoItem = (video: SDGVideoData) => (
        <div key={video._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <Link href={`/videos/${video._id}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                        <img 
                            src={video.thumbnail_url} 
                            alt={video.title} 
                            className="w-32 h-24 object-cover rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{video.channel_name}</p>
                        {video.description && (
                            <p className="text-gray-600 line-clamp-2">{video.description}</p>
                        )}
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="mr-2">{video.views || 0} views</span>
                            <span className="mr-2">•</span>
                            <span>{video.likes || 0} likes</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );

    // Handler for rendering post items
    const renderPostItem = (post: Post) => (
        <div key={post._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <Link href={`/post/${post._id}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                    {post.user_id.profileImage && (
                        <img 
                            src={post.user_id.profileImage} 
                            alt={post.user_id.name || post.user_id.username} 
                            className="w-10 h-10 object-cover rounded-full"
                        />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{post.user_id.name || post.user_id.username}</h3>
                    <p className="text-gray-600 mt-2">{post.content}</p>
                    {post.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {post.images.slice(0, 3).map((image, index) => (
                                <img 
                                    key={index} 
                                    src={image} 
                                    alt={`Post image ${index+1}`}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            ))}
                            {post.images.length > 3 && (
                                <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                                    <span className="text-gray-600">+{post.images.length - 3}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                        <span className="mr-2">{post.poststat_id?.likes || 0} likes</span>
                        <span className="mr-2">•</span>
                        <span className="mr-2">{post.poststat_id?.comments || 0} comments</span>
                        <span className="mr-2">•</span>
                        <span>{post.poststat_id?.reposts || 0} reposts</span>
                    </div>
                </div>
            </div>
            </Link>
        </div>
    );

  return (
    <div className='flex flex-col flex-1 overflow-hidden p-4'>
        <div className="flex w-full h-fit items-center mb-2">
            <ArrowLeft size={30} className='mr-5 cursor-pointer'onClick={() => window.location.href = '/'}/>
            <div className="w-full h-fit mx-auto relative">
                <input
                    type="text"
                    value={searchQuery}
                    onKeyDown={handleSearch}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-600 py-2 px-4 rounded-full text-lg "
                    placeholder="Search..."
                />
                <Search color='black' className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>

        {/* Tab Navigation */}
        
        <div className="flex space-x-2 overflow-x-auto p-2 justify-center">
                        {SEARCH_RESULT_CATEGORIES.map((tab, index) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-1 rounded-full cursor-pointer text-lg font-semibold whitespace-nowrap",
                                    activeTab === tab
                                    ? "bg-accent text-white"
                                    : "bg-white text-accent border border-accent"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-2">
            {activeTab === SEARCH_RESULT_CATEGORIES[0] && (
                <div className="mx-auto  space-y-12">
                    {/* People Section */}
                    <section className='border px-5 py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-2xl font-bold mb-6">People</h2>
                        <div className="space-y-4 ">
                            {users.length > 0 ? (
                                users.map(user => (
                                    <PersonCard
                                        key={user._id}
                                        user={user}
                                        handleFollowToggle={handleFollowToggle}
                                        followMutation={followMutation}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">No people found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* Posts Section */}
                    <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-2xl font-bold mb-6">Posts</h2>
                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map(post => renderPostItem(post))
                            ) : (
                                <p className="text-gray-500">No posts found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* News Section */}
                    <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-2xl font-bold mb-6">News</h2>
                        <div className="space-y-4">
                            {articles.length > 0 ? (
                                articles.map(article => (
                                    <ArticleCard
                                        key={article._id}
                                        article={article}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">No news found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* Videos Section */}
                    <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-2xl font-bold mb-6">Videos</h2>
                        <div className="space-y-4">
                            {videos.length > 0 ? (
                                videos.map(video => renderVideoItem(video))
                            ) : (
                                <p className="text-gray-500">No videos found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* Schemes Section */}
                    {/* <section>
                        <h2 className="text-accent text-2xl font-bold mb-6">Schemes</h2>
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Assistance under SC/ST Prevention of Atrocities Act</h3>
                            <p className="text-gray-600 leading-relaxed">The scheme 'Assistance under SC/ST Prevention of Atrocities Act' was introduced by the Adi Dravidar Welfare Department, Government of Puducherry. The objective of the scheme is to...</p>
                        </div>
                    </section> */}
                </div>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[1] && (
                <section className='border px-5 py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-2xl font-bold mb-6">People</h2>
                    <div className="space-y-4 ">
                        {users.length > 0 ? (
                            users.map(user => (
                                <PersonCard
                                    key={user._id}
                                    user={user}
                                    handleFollowToggle={handleFollowToggle}
                                    followMutation={followMutation}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No people found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[2] && (
                <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-2xl font-bold mb-6">Posts</h2>
                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map(post => renderPostItem(post))
                        ) : (
                            <p className="text-gray-500">No posts found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[3] && (
                <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-2xl font-bold mb-6">News</h2>
                    <div className="space-y-4">
                        {articles.length > 0 ? (
                            articles.map(article => (
                                <ArticleCard
                                    key={article._id}
                                    article={article}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500">No news found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[4] && (
                <section className='border p-5 py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-2xl font-bold mb-6">Videos</h2>
                    <div className="space-y-4">
                        {videos.length > 0 ? (
                            videos.map(video => renderVideoItem(video))
                        ) : (
                            <p className="text-gray-500">No videos found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {/* Add similar blocks for other tabs */}
        </div>
    </div>
  )
}

export default SearchPageClient