"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { VIDEO_TABS } from '@/lib/constants/index-constants';
import React, { useState } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("The SDG Talks");
  return (
    <div className='flex flex-1'>
        <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={VIDEO_TABS}/>
    </div>
  )
}

export default Page