"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import { TrendingSection } from '@/components/feed/TrendingNow'
import { UserSidebar } from '@/components/feed/UserProfile'
import React, { useState } from 'react'

export default function Home() {
  return (
    
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex overflow-y-auto p-4 gap-6">
          <aside className="hidden xl:block sticky h-fit">
            <UserSidebar />
          </aside>
          <ContentFeed />
          <aside className="hidden xl:block sticky ">
            <TrendingSection />
          </aside>
        </main>
      </div>
  )
}
