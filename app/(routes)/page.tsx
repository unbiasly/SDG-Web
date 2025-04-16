"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import CreatePost from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import SDGNews from '@/components/feed/SDGNews';
import { FEED_TABS } from '@/lib/constants/index-constants'
import { formatDate } from '@/lib/utilities/formatDate';
import { fetchPosts } from '@/service/posts.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import Loading from '../loading';

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("For You");
  const { ref, inView } = useInView();

  // Set up infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage) => {
      // Extract the cursor from the pagination data
      return lastPage.pagination?.nextCursor || undefined;
    },
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch next page when the load more element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  // Show loading state
  if (status === 'pending') {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show error state
  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading posts</p>
      </div>
    );
  }

  // Flatten the pages into a single array of posts
  const posts = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="flex flex-1 overflow-hidden">
      <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={FEED_TABS}>
        {FEED_TABS && (
          <>
            {activeTab === "For You" && (
              <>
                <CreatePost />
                <div className="px-4 space-y-4">
                  {posts.filter(post => post !== undefined).map((post) => (
                    <PostCard
                      key={post._id}
                      isReposted={post.original_post_id !== null}
                      _id={post._id}
                      name={post.user_id.name || `@${post.user_id.username}`}
                      handle={`@${post.user_id.username}`}
                      avatar={post.user_id.profileImage || ''}
                      time={formatDate(post.updatedAt)}
                      isLiked={post.isLiked}
                      userId={post.user_id._id}
                      isBookmarked={post.isBookmarked || false}
                      content={post.content}
                      imageUrl={post.images}
                      likesCount={post.poststat_id?.likes || 0}
                      commentsCount={post.poststat_id?.comments || 0}
                      repostsCount={post.poststat_id?.reposts || 0}
                    />
                  ))}
                  
                  {/* Loading indicator and ref for intersection observer */}
                  {(hasNextPage || isFetchingNextPage) && (
                    <div 
                      className="flex justify-center py-4" 
                      ref={ref}
                    >
                      {isFetchingNextPage ? (
                        <div className="w-6 h-6 border-2 border-accent rounded-full border-t-transparent animate-spin"></div>
                      ) : (
                        <div className="h-16"></div>
                      )}
                    </div>
                  )}
                  
                  {/* End of content message */}
                  {!hasNextPage && posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                      You've reached the end
                    </div>
                  )}
                </div>
              </>
            )}
            {activeTab === "The SDG News" && <SDGNews />}
          </>
        )}
      </ContentFeed>
    </div>
  )
}
