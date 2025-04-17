"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import CreatePost from '@/components/feed/CreatePost';
import { PostCard } from '@/components/feed/PostCard';
import SDGNews from '@/components/feed/SDGNews';
import { FEED_TABS } from '@/lib/constants/index-constants'
import { formatDate } from '@/lib/utilities/formatDate';
import { fetchPosts } from '@/service/posts.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer';
import Loading from '../loading';
import { useUser } from '@/lib/redux/features/user/hooks';

export default function Home() {
  const [activeTab, setActiveTab] = React.useState("For You");
  const { ref, inView } = useInView();
  const { user } = useUser();

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

  // Flatten the pages into a single array of posts
  const posts = data?.pages.flatMap(page => page.data) || [];

  // Fetch next page when the load more element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  // Track post impressions
const trackPostImpression = async (postId: string, userId: string) => {
    if (!user?._id) return;
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track',
          type: 'post_impression',
          viewerId: user._id,
          postId,
          userId
        }),
      });
    } catch (error) {
      console.error("Failed to track post impression:", error);
    }
  };
  
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
      <div className="flex flex-1 justify-center items-center h-screen">
        <p className="text-red-500">Error loading posts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={FEED_TABS}>
        {FEED_TABS && (
          <>
            {activeTab === "For You" && (
              <>
                <CreatePost />
                <div className="px-4 space-y-4">
                  {posts.filter(post => post !== undefined).map((post) => {
                    // Create props for the PostWithTracking component
                    return (
                      <PostWithTracking 
                        key={post._id}
                        post={post}
                        user={user}
                        onImpression={trackPostImpression}
                      />
                    );
                  })}
                  
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
                      ......
                    </div>
                  )}
                </div>
              </>
            )}
            {/* {activeTab === "The SDG News" && <SDGNews />} */}
          </>
        )}
      </ContentFeed>
    </div>
  )
}

// Separate component for the post with tracking
interface PostWithTrackingProps {
  post: {
    _id: string;
    user_id: {
      _id: string;
      name?: string;
      username: string;
      profileImage?: string;
    };
    content: string;
    images?: string[];
    updatedAt: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    original_post_id: string | null;
    poststat_id?: {
      likes: number;
      comments: number;
      reposts: number;
    } | null;
  };
  user: {
    _id?: string;
  } | null | undefined;
  onImpression: (postId: string, userId: string) => Promise<void>;
}

function PostWithTracking({ post, user, onImpression }: PostWithTrackingProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true, // Only trigger once when post becomes visible
  });
  
  // Track impression only when post comes into view
  useEffect(() => {
    if (inView && user?._id && post._id && post.user_id._id) {
      // Only call the API when this specific post is in the viewport
      onImpression(post._id, post.user_id._id);
    }
  }, [inView, post._id, post.user_id._id, user?._id, onImpression]);

  return (
    <div ref={ref}>
      <PostCard
        isReposted={post.original_post_id !== null}
        key={post._id}
        _id={post._id}
        name={post.user_id.name || `@${post.user_id.username}`}
        handle={`@${post.user_id.username}`}
        avatar={post.user_id.profileImage || ''}
        time={formatDate(post.updatedAt)}
        isLiked={post.isLiked || false}
        userId={post.user_id._id}
        isBookmarked={post.isBookmarked || false}
        content={post.content}
        imageUrl={post.images|| []}
        likesCount={post.poststat_id?.likes || 0}
        commentsCount={post.poststat_id?.comments || 0}
        repostsCount={post.poststat_id?.reposts || 0}
      />
    </div>
  );
}
