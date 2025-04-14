"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import NotificationList from '@/components/notification/NotificationList';
import { MOCK_NOTIFICATIONS, NOTIFICATION_TABS } from '@/lib/constants/index-constants';
import React, { useState } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("All");
  return (
    <div className='flex flex-1'>
        <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={NOTIFICATION_TABS}>
            {NOTIFICATION_TABS && <NotificationList activeTab={activeTab || ''} />}
        </ContentFeed>
      
    </div>
  )
}

export default Page