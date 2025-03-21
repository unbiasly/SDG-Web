"use client"
import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { TABS } from '@/lib/constants/feed-constants';
import TSSNews from './TSSNews';

export const ContentFeed: React.FC = () => {
  
  const [activeTab, setActiveTab] = useState("For You");

  return (
    <div className="flex-1 bg-white rounded-2xl border-2 border-gray-300">
      <div className="border-b border-gray-300 mb-4">
        <div className="flex  justify-center py-2 ">
          {TABS.map((tab, index) => (
            <div key={tab} className='flex'>
              <button
                className={`tab-button text-xl font-medium cursor-pointer ${activeTab === tab ? 'border-b-2 border-b-black active' : 'border-b-2 border-b-transparent'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
              {index < TABS.length - 1 && <div className="mx-10 border-r border-l border-black rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>
      {activeTab === "For You" && (
        <div className="px-4 space-y-4">
          {[1, 2, 3, 4].map((post) => (
            <PostCard
              key={post}
              name="UNDP India"
              handle="@UNDPIndia"
              time="21 hrs 54 mins"
              isVerified={true}
              content="MOU Signed Between Government of West Bengal and UNDP to Strengthen Collaboration for Development"
              imageUrl="/mou-signing.jpg"
              likesCount="298"
              commentsCount="20"
              repostsCount="20"
            />
          ))}
        </div>
      )}
      {activeTab === "The SDG News" && (
        <TSSNews/>
      )}
    </div>
  );
};