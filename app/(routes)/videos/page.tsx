"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import VideoCard from '@/components/video/VideoCard';
import { VIDEO_TABS } from '@/lib/constants/index-constants';
import { useUser } from '@/lib/redux/features/user/hooks';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Loading from '@/components/Loader';
import { SDGVideoResponse } from '@/service/api.interface';

const Page = () => {
    const [activeTab, setActiveTab] = useState("The SDG Talks");
    const { ref, inView } = useInView();
    const { user } = useUser();
    const queryClient = useQueryClient();
    
    // Add state for tracking which video is currently playing
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    
    const getVideoType = useMemo(() => {
      if (activeTab === "The SDG Talks") return "talk";
      if (activeTab === "The SDG Podcast") return "podcast";
      return "talk"; // default
    }, [activeTab]);
    
    // Memoize the fetchVideos function (but without error conditions)
    const fetchVideos = useMemo(() => 
      async ({ pageParam = '', type = 'talk', limit = 30 }): Promise<SDGVideoResponse> => {
        const response = await fetch('/api/video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            cursor: pageParam,
            limit,
            type,
            userId: user?._id,
          }),
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
      
        return response.json();
      },
      [user?._id] // Only depend on user._id, not the entire user object
    );

    // Configure query options with proper caching strategy
    const queryOptions = useMemo(() => ({
      queryKey: ['sdgVideos', getVideoType, user?._id], // Include user ID in the query key
      queryFn: ({ pageParam }: { pageParam: string }) => fetchVideos({ 
        pageParam, 
        type: getVideoType,
        limit: 30
      }),
      initialPageParam: '',
      getNextPageParam: (lastPage: SDGVideoResponse) => lastPage.pagination?.nextCursor || undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: Boolean(user?._id), // Only enable the query when user ID is available
    }), [getVideoType, fetchVideos, user?._id]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery(queryOptions);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  // Prefetch data for other tabs when idle
  useEffect(() => {
    const prefetchOtherTabData = () => {
      const otherType = getVideoType === 'talk' ? 'podcast' : 'talk';
      queryClient.prefetchInfiniteQuery({
        queryKey: ['sdgVideos', otherType],
        queryFn: ({ pageParam = '' }) => fetchVideos({ 
          pageParam, 
          type: otherType,
          limit: 10 // Prefetch fewer items for other tab
        }),
        initialPageParam: ''
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchOtherTabData);
    } else {
      setTimeout(prefetchOtherTabData, 2000);
    }
  }, [getVideoType, queryClient, fetchVideos]);

  // Refetch when tab changes (only if necessary)
  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    setPlayingVideoId(null); // Close any playing videos
    
    // Check if we already have data for this tab
    const newType = newTab === "The SDG Talks" ? "talk" : "podcast";
    const hasData = queryClient.getQueryData(['sdgVideos', newType]);
    
    if (!hasData) {
      // Only refetch if we don't have data already
      setTimeout(() => refetch(), 0);
    }
  }, [queryClient, refetch]);

  // Memoize video data to prevent unnecessary re-renders
  const videos = useMemo(() => 
    data?.pages.flatMap(page => page.data) || [],
    [data?.pages]
  );

  // Show loading state
  if (status === 'pending') {
    return (
      <div className="flex-1 bg-white bg-opacity-75 z-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show error state
  if (status === 'error') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading {getVideoType === 'talk' ? 'videos' : 'podcasts'}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-1'>
      <ContentFeed
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tabs={VIDEO_TABS}
      >
        <div className="flex justify-end mb-2">
          {/* <button aria-label="filter" className="p-2 rounded-md hover:bg-gray-100">
            <Filter className="h-5 w-5 text-gray-500" />
          </button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 px-4 gap-4">
          {videos.map((video) => (
            <div className='px-0' key={video._id}>
              <VideoCard 
                video={video} 
                playingVideoId={playingVideoId}
                setPlayingVideoId={setPlayingVideoId}
              />
            </div>
          ))}
          
          {/* Loading indicator and ref for intersection observer */}
          {(hasNextPage || isFetchingNextPage) && (
            <div
              className="col-span-full flex justify-center py-4"
              ref={ref}
            >
              {isFetchingNextPage ? (
                <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <div className="h-16"></div>
              )}
            </div>
          )}
          
          {/* End of content message */}
          {!hasNextPage && videos.length > 0 && (
            <div className="col-span-full text-center py-4 text-gray-500">
              You've reached the end
            </div>
          )}
          
          {/* Empty state */}
          {videos.length === 0 && !isFetchingNextPage && (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
              <p className="text-xl text-gray-500">
                No {getVideoType === 'talk' ? 'videos' : 'podcasts'} available
              </p>
            </div>
          )}
        </div>
      </ContentFeed>
    </div>
  );
};

// Prevent unnecessary re-renders by exporting a memoized component
export default React.memo(Page);