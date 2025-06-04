import React, { useState, useRef, useEffect } from 'react';
import { PostCard } from './PostCard';
import { useUser } from '@/lib/redux/features/user/hooks';
import { formatDate } from '@/lib/utilities/formatDate';
import { Post } from '@/service/api.interface';

interface PostWithImpressionTrackingProps {
  post: Post;
  onPostUpdate: () => void;
}

export const PostWithImpressionTracking: React.FC<PostWithImpressionTrackingProps> = ({ post, onPostUpdate }) => {
  const { user } = useUser();
  const postRef = useRef<HTMLDivElement>(null);
  const [hasTracked, setHasTracked] = useState(false);
  
  // Set up intersection observer for immediate tracking
  useEffect(() => {
    if (!postRef.current || !user?._id || hasTracked) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Only track if post is visible and hasn't been tracked yet
        if (entry.isIntersecting && !hasTracked) {
          console.log("Tracking impression for post:", post._id);
          trackPostImpression(post._id, post.user_id._id);
          setHasTracked(true);
          
          // Disconnect observer after tracking once
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Consider post viewed when 50% visible
    );
    
    observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [post._id, hasTracked, user?._id]);
  
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
        post={post}
        onPostUpdate={onPostUpdate}
      />
    </div>
  );
};