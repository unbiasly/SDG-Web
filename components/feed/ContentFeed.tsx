"use client"
import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { TABS } from '@/lib/constants/feed-constants';
import TSSNews from './TSSNews';
import CreatePost from './CreatePost';

export const ContentFeed: React.FC = () => {
    
    const [activeTab, setActiveTab] = useState("The SDG News");

  return (
    <div className=" bg-white rounded-sm border-1 border-gray-300">
      <div className="border-b border-gray-300 mb-0.5">
        <div className="flex w-full justify-evenly ">
          {TABS.map((tab, index) => (
            <React.Fragment key={tab}>
              <div className={` py-2  ${activeTab === tab ? 'border-b-2 border-b-black active' : 'border-b-2 border-b-transparent'}`}>
                <button
                  className="flex justify-center text-xl font-medium cursor-pointer"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </div>
              {index < TABS.length - 1 && <div className=" my-2 border-r border-l border-gray-300 rounded-full"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      {activeTab === "For You" && (
        <>
            <CreatePost />
            <div className="px-4 space-y-4">
                {[1, 2, 3, 4].map((post) => (
                    <PostCard
                        key={post}
                        name="UNDP India"
                        handle="@UNDPIndia"
                        avatar="/feed/undp-logo-blue.svg"
                        time="21 hrs 54 mins"
                        isVerified={true}
                        content="MOU Signed Between Government of West Bengal and UNDP to Strengthen Collaboration for Development"
                        imageUrl="/feed/mou-signing.jpg"
                        likesCount="298"
                        commentsCount="20"
                        repostsCount="20"
                    />
                ))}
            </div>
        </>
      )}
      {activeTab === "The SDG News" && (
        <TSSNews/>
      )}
    </div>
  );
};