import { ContentFeed } from '@/components/feed/ContentFeed'
import { TrendingSection } from '@/components/feed/TrendingNow'
import { UserSidebar } from '@/components/feed/UserProfile'
import React from 'react'

const Page = () => {
  return (
    
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex overflow-y-auto p-4 gap-6">
          <aside className="hidden xl:block sticky top-20 h-fit">
            <UserSidebar />
          </aside>
          <ContentFeed />
          <aside className="hidden xl:block sticky top-20 h-fit">
            <TrendingSection />
          </aside>
        </main>
      </div>
  )
}

export default Page