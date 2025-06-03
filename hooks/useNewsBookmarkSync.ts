import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useUser } from '@/lib/redux/features/user/hooks';
import { toast } from 'react-hot-toast';

/**
 * Hook specifically for synchronizing news bookmark operations between
 * TrendingNow component and Bookmarks page.
 */
export function useNewsBookmarkSync() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  // This single mutation will be used by both components
  const toggleNewsBookmark = useMutation({
    mutationFn: async ({ 
      newsId, 
      currentState = false 
    }: { 
      newsId: string; 
      currentState?: boolean;
    }) => {
      console.log('Calling API to toggle bookmark for news ID:', newsId, 'Current state:', currentState);
      
      const response = await fetch('/api/sdgNews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsId,
          actionType: 'bookmark',
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to ${currentState ? 'remove' : 'add'} bookmark: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      return { newsId, bookmarked: !currentState };
    },
    
    onSuccess: (data) => {
      console.log('Bookmark toggle successful:', data);
      
      // Show success message
      toast.success(data.bookmarked ? 
        "Added to bookmarks" : 
        "Removed from bookmarks"
      );
      
      // CRITICAL: Invalidate BOTH queries to ensure both components update
      console.log('Invalidating queries...');
      
      // 1. Invalidate the bookmarked news query used by the Bookmarks page
      queryClient.invalidateQueries({ queryKey: ['bookmarkedNews'] });
      
      // 2. Invalidate the feed query used by the TrendingNow component
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ['sdgNews', user._id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['sdgNews'] });
      }
    },
    
    onError: (error) => {
      console.error('Error toggling news bookmark:', error);
      toast.error('Failed to update bookmark');
      
      // On error, invalidate both queries to restore consistent state
      queryClient.invalidateQueries({ queryKey: ['bookmarkedNews'] });
      if (user?._id) {
        queryClient.invalidateQueries({ queryKey: ['sdgNews', user._id] });
      }
    }
  });

  return { toggleNewsBookmark };
}
