"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import VideoCard from '@/components/video/VideoCard';
import { VIDEO_TABS } from '@/lib/constants/index-constants';
import { useUser } from '@/lib/redux/features/user/hooks';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Filter } from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Loading from '../../loading';
import { SDGVideoResponse } from '@/service/api.interface';

// Video/podcast fetching service that handles both types
const fetchVideos = async ({ pageParam = '', type = 'talk', limit = 30 }): Promise<SDGVideoResponse> => {
  const response = await fetch('/api/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      cursor: pageParam,
      limit,
      type
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  return response.json();
};

const Page = () => {
  const [activeTab, setActiveTab] = useState("The SDG Talks");
  const { ref, inView } = useInView();
  const { user } = useUser();
  const queryClient = useQueryClient();
  
  // Memoize video type function to prevent unnecessary re-renders
  const getVideoType = useMemo(() => {
    if (activeTab === "The SDG Talks") return "talk";
    if (activeTab === "The SDG Podcast") return "podcast";
    return "talk"; // default
  }, [activeTab]);

  // Configure query options with proper caching strategy
  const queryOptions = useMemo(() => ({
    queryKey: ['sdgVideos', getVideoType],
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
  }), [getVideoType]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery(queryOptions);

  // Memoized callback for fetching next page
  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Fetch next page when the load more element comes into view
  useEffect(() => {
    if (inView) {
      handleFetchNextPage();
    }
  }, [inView, handleFetchNextPage]);

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
  }, [getVideoType, queryClient]);

  // Refetch when tab changes (only if necessary)
  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
    
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
      <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
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
          <button aria-label="filter" className="p-2 rounded-md hover:bg-gray-100">
            <Filter className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 px-4 gap-4">
          {videos.map((video) => (
            <React.Fragment key={video._id}>
              <VideoCard video={video} />
            </React.Fragment>
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