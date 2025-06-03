'use client'
import { SEARCH_RESULT_CATEGORIES } from '@/lib/constants/index-constants';
import React, { useEffect, useState, useCallback } from 'react' // Added useCallback
import { Article, ArticleCard } from '../feed/SDGNews';
import PersonCard, { User } from './PersonCard';
import { ArrowLeft, Search } from 'lucide-react';
import { Post, SearchResultResponse, SDGVideoData } from '@/service/api.interface';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// --- Skeleton Components ---

const PersonCardSkeleton = () => (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-md w-20 ml-auto"></div>
        </div>
    </div>
);

const PostItemSkeleton = () => (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-start">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md"></div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md"></div>
                </div>
                <div className="mt-3 flex items-center text-xs">
                    <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
        </div>
    </div>
);

const ArticleCardSkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-32 sm:h-40 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
);

const VideoItemSkeleton = () => (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start">
            <div className="w-full h-48 sm:w-32 sm:h-24 bg-gray-200 rounded-md mb-3 sm:mb-0 sm:mr-4"></div>
            <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="flex items-center text-xs">
                    <div className="h-3 bg-gray-200 rounded w-12 mr-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
        </div>
    </div>
);

const SKELETON_COUNT = 3; // Number of skeletons to display

// --- End Skeleton Components ---

const SearchPageClient = ({ q }: { q: string }) => {
    const [searchQuery, setSearchQuery] = useState(q);
    const [activeTab, setActiveTab] = useState(SEARCH_RESULT_CATEGORIES[0]);
    const [searchResults, setSearchResults] = useState<SearchResultResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Added loading state

    // console.log("Search results:", searchResults);
    
    const users = searchResults?.data?.users || [];
    const articles = searchResults?.data?.news || [];
    const posts = searchResults?.data?.posts || [];
    const videos = searchResults?.data?.video || [];

    const getSearchResults = useCallback(async (query: string) => {
        if (!query) {
            setSearchResults(null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            // console.log("Search results:", data);
            setSearchResults(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults(null); // Clear results on error
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array as it doesn't depend on component state/props directly

    useEffect(() => {
        setSearchQuery(q); // Sync searchQuery state with q prop
        getSearchResults(q);
    }, [q, getSearchResults]);


    const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>)  => {
        if (event.key === 'Enter') {
          const query = event.currentTarget.value;
          // Update searchQuery state for the input field
          setSearchQuery(query);
          // Fetch results
          getSearchResults(query);
          // Optional: Update URL to reflect the new search query if desired
          // window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      }
    }
    
    // Handler for rendering video items
    const renderVideoItem = (video: SDGVideoData) => (
        <div key={video._id} className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
            <Link href={`/videos/${video._id}`}>
                <div className="flex flex-col sm:flex-row items-start">
                    <div className="w-full sm:w-auto sm:flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                        <img 
                            src={video.thumbnail_url} 
                            alt={video.title} 
                            className="w-full h-48 sm:w-32 sm:h-24 object-cover rounded-md"
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
        <div key={post._id} className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-gray-100">
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
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                />
                            ))}
                            {post.images.length > 3 && (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md flex items-center justify-center">
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
    <div className='flex flex-col flex-1 overflow-hidden p-2 sm:p-4'>
        <div className="flex w-full h-fit items-center mb-2">
            <ArrowLeft size={30} className='mr-2 sm:mr-5 cursor-pointer' onClick={() => window.location.href = '/'}/>
            <div className="w-full h-fit mx-auto relative">
                <input
                    type="text"
                    value={searchQuery} // Controlled input
                    onKeyDown={handleSearch}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on change
                    className="w-full border border-gray-600 py-1 sm:py-2 px-3 sm:px-4 rounded-full text-base sm:text-lg"
                    placeholder="Search..."
                />
                <Search color='black' className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 px-1 justify-start sm:justify-center">
            {SEARCH_RESULT_CATEGORIES.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-2 sm:px-4 py-1 rounded-full cursor-pointer text-sm sm:text-lg font-semibold whitespace-nowrap",
                        activeTab === tab
                        ? "bg-accent text-white"
                        : "bg-white text-accent border border-accent"
                    )}
                    disabled={isLoading} // Disable tabs while loading
                >
                    {tab.label}
                </button>
            ))}
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-2">
            {activeTab === SEARCH_RESULT_CATEGORIES[0] && ( // "All" Tab
                <div className="mx-auto space-y-6 sm:space-y-12">
                    {/* People Section */}
                    <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">People</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(SKELETON_COUNT).fill(0).map((_, i) => <PersonCardSkeleton key={`person-skeleton-${i}`} />)
                            ) : users.length > 0 ? (
                                users.map(user => (
                                    <PersonCard key={user._id} user={user} />
                                ))
                            ) : (
                                <p className="text-gray-500">No people found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* Posts Section */}
                    <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Posts</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(SKELETON_COUNT).fill(0).map((_, i) => <PostItemSkeleton key={`post-skeleton-${i}`} />)
                            ) : posts.length > 0 ? (
                                posts.map(post => renderPostItem(post))
                            ) : (
                                <p className="text-gray-500">No posts found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* News Section */}
                    <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">News</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(SKELETON_COUNT).fill(0).map((_, i) => <ArticleCardSkeleton key={`article-skeleton-${i}`} />)
                            ) : articles.length > 0 ? (
                                articles.map(article => (
                                    <ArticleCard key={article._id} article={article} />
                                ))
                            ) : (
                                <p className="text-gray-500">No news found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>

                    {/* Videos Section */}
                    <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                        <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Videos</h2>
                        <div className="space-y-4">
                            {isLoading ? (
                                Array(SKELETON_COUNT).fill(0).map((_, i) => <VideoItemSkeleton key={`video-skeleton-${i}`} />)
                            ) : videos.length > 0 ? (
                                videos.map(video => renderVideoItem(video))
                            ) : (
                                <p className="text-gray-500">No videos found matching "{searchQuery}"</p>
                            )}
                        </div>
                    </section>
                </div>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[1] && ( // "People" Tab
                <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">People</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array(SKELETON_COUNT).fill(0).map((_, i) => <PersonCardSkeleton key={`person-skeleton-tab-${i}`} />)
                        ) : users.length > 0 ? (
                            users.map(user => (
                                <PersonCard key={user._id} user={user} />
                            ))
                        ) : (
                            <p className="text-gray-500">No people found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[2] && ( // "Posts" Tab
                <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Posts</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array(SKELETON_COUNT).fill(0).map((_, i) => <PostItemSkeleton key={`post-skeleton-tab-${i}`} />)
                        ) : posts.length > 0 ? (
                            posts.map(post => renderPostItem(post))
                        ) : (
                            <p className="text-gray-500">No posts found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[3] && ( // "News" Tab
                <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">News</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array(SKELETON_COUNT).fill(0).map((_, i) => <ArticleCardSkeleton key={`article-skeleton-tab-${i}`} />)
                        ) : articles.length > 0 ? (
                            articles.map(article => (
                                <ArticleCard key={article._id} article={article} />
                            ))
                        ) : (
                            <p className="text-gray-500">No news found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[4] && ( // "Videos" Tab
                <section className='border px-3 sm:px-5 py-4 sm:py-6 rounded-2xl border-gray-300'>
                    <h2 className="text-accent text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Videos</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array(SKELETON_COUNT).fill(0).map((_, i) => <VideoItemSkeleton key={`video-skeleton-tab-${i}`} />)
                        ) : videos.length > 0 ? (
                            videos.map(video => renderVideoItem(video))
                        ) : (
                            <p className="text-gray-500">No videos found matching "{searchQuery}"</p>
                        )}
                    </div>
                </section>
            )}
        </div>
    </div>
  )
}

export default SearchPageClient