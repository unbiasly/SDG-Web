"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { FEED_TABS } from '@/lib/constants/index-constants'
import { PostsFetchResponse } from '@/service/api.interface';
import React, { useEffect, useState } from 'react'

export default function Home() {
    const [activeTab, setActiveTab] = useState("For You");
    
    useEffect(() => {
        
        
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
        
        getAllPosts();
    }, []);

    const [posts, setPosts] = useState<PostsFetchResponse>();


  return (
    
      <div className="flex flex-1 overflow-hidden">
          <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={FEED_TABS} content={posts?.data || []} />
          
      </div>
  )
}
