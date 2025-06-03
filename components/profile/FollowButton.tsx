'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useQueryClient } from '@tanstack/react-query';

interface FollowButtonProps {
    targetId?: string;
    userId: string;
    followed?: boolean| null;
    onFollowChange?: (isFollowing: boolean) => void;

}

const FollowButton = ({ targetId, userId, followed, onFollowChange }: FollowButtonProps) => {

    const [isFollowing, setIsFollowing] = useState(followed);
    const queryClient = useQueryClient();
    const handleFollow = async () => {
        
        const response = await fetch(`/api/follow`, {
            method: 'POST',
            body: JSON.stringify({ followingId: targetId, userId, action: 'follow' }),
        });
        const data = await response.json();
        if (data.success) {
            setIsFollowing(true);
            if (onFollowChange) {
                onFollowChange(true);
            }
            queryClient.invalidateQueries({ queryKey: ["following", userId] });
        }
    }

    const handleUnfollow = async () => {
    
        const response = await fetch(`/api/follow`, {
            method: 'POST',
            body: JSON.stringify({ followingId: targetId, userId, action: 'unfollow' }),
        });
        const data = await response.json();
        if (data.success) {
            setIsFollowing(false);
            if (onFollowChange) {
                onFollowChange(false);
            }
            queryClient.invalidateQueries({ queryKey: ["following", userId] });
        }
    }

    const handleToggleFollow = async () => {
        if (isFollowing) {
            await handleUnfollow();
        } else {
            await handleFollow();
        }
    }

  return (
    <Button onClick={handleToggleFollow} className="rounded-full cursor-pointer px-6 py-2 bg-accent hover:bg-accent/80 text-white border-none backdrop-blur-sm transition-all duration-300 font-medium">
        {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowButton