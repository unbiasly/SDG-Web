"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { FEED_TABS } from '@/lib/constants/index-constants'
import { fetchUserFailure, fetchUserStart, fetchUserSuccess } from '@/lib/redux/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { PostsFetchResponse } from '@/service/api.interface';
import React, { useEffect, useState } from 'react'

export default function Home() {
    const [activeTab, setActiveTab] = useState("For You");
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const fetchUserData = async () => {
            dispatch(fetchUserStart());
            try {
                const response = await fetch('/api', {
                    credentials: 'include'
                });
                const data = await response.json();
                dispatch(fetchUserSuccess(data));
            } catch (error) {
                console.error(error);
                dispatch(fetchUserFailure(error instanceof Error ? error.message : 'An unknown error occurred'));
            }
        };
        
        const getAllPosts = async () => {
            try {
                const postsResponse = await fetch('/api/getPosts');
                const postsData = await postsResponse.json();
                setPosts(postsData);
                return postsData;
            } catch(error) {
                console.error("Post Fetch Error \n", error);
                return null;
            }
        }
        
        fetchUserData();
        getAllPosts();
    }, [dispatch]);

    const [posts, setPosts] = useState<PostsFetchResponse>();


  return (
    
      <div className="flex flex-1 overflow-hidden">
          <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={FEED_TABS} content={posts?.data || []} />
          
      </div>
  )
}
