"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { SCHEME_TABS } from '@/lib/constants/index-constants';
import React, { useState } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("Categories");
  return (
    <div className='flex flex-1'>
        <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={SCHEME_TABS}/>
    </div>
  )
}

export default Page