import React, { useState, useRef, useEffect } from 'react';
import { PostCard } from './PostCard';
import { useUser } from '@/lib/redux/features/user/hooks';
import { formatDate } from '@/lib/utilities/formatDate';

// Set a delay after initial load before tracking can begin
// const INITIAL_LOAD_DELAY = 10;

interface PostWithImpressionTrackingProps {
  post: any;
  onPostUpdate: () => void;
}

export const PostWithImpressionTracking: React.FC<PostWithImpressionTrackingProps> = ({ post, onPostUpdate }) => {
  const { user } = useUser();
  const postRef = useRef<HTMLDivElement>(null);
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false);
  const [canTrackImpressions, setCanTrackImpressions] = useState(true);

  // Track if this post was present on initial load
  const isInitialPost = useRef(true);
  
  
  // Set up intersection observer
  useEffect(() => {
    if (!postRef.current || !user?._id) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Only track impression if:
        // 1. Post is visible
        // 2. Tracking is enabled (after delay)
        // 3. Not already tracked
        // 4. Either: not an initial post OR we're scrolling (isInitialPost becomes false after it leaves view once)
        if (entry.isIntersecting && canTrackImpressions && !hasTrackedImpression && isInitialPost.current) {
            trackPostImpression(post._id, post.user_id._id);
            setHasTrackedImpression(true);
        }
        
        // If post leaves view, it's no longer considered an initial post
        // This way when it comes back into view during scrolling, it will be tracked
        if (!entry.isIntersecting && isInitialPost.current) {
          isInitialPost.current = false;
        }
      },
      { threshold: 0.5 } // Consider post viewed when 50% visible
    );
    
    observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [post._id, hasTrackedImpression, canTrackImpressions, user?._id]);
  
  // Track post impression function
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

  return (
    <div ref={postRef}>
      <PostCard
        isReposted={post.isReposted}
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
        isFollowed={post.user_id.isFollowing || undefined}
        likesCount={post.poststat_id?.likes || 0}
        commentsCount={post.poststat_id?.comments || 0}
        repostsCount={post.poststat_id?.reposts || 0}
        onPostUpdate={onPostUpdate}
      />
    </div>
  );
};