'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'

interface FollowButtonProps {
    targetId?: string;
    userId: string;
    followed?: boolean;

}

const FollowButton = ({ targetId, userId }: FollowButtonProps) => {

    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = async () => {
        
        const response = await fetch(`/api/follow`, {
            method: 'POST',
            body: JSON.stringify({ followingId: targetId, userId, action: 'follow' }),
        });
        const data = await response.json();
        if (data.success) {
            setIsFollowing(true);
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