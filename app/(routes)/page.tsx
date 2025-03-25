"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { FEED_TABS } from '@/lib/constants/index-constants'
import React, { useState } from 'react'

export default function Home() {
    const [activeTab, setActiveTab] = useState("For You");
  return (
    
      <div className="flex flex-1 overflow-hidden">
          <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={FEED_TABS} />
          
      </div>
  )
}
