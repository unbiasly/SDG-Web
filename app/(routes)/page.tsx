"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { TrendingSection } from '@/components/feed/TrendingNow'
import { UserSidebar } from '@/components/feed/UserProfile'
import React, { useState } from 'react'

export default function Home() {
  return (
    
      <div className="flex flex-1 overflow-hidden">
          <ContentFeed />
          
      </div>
  )
}
