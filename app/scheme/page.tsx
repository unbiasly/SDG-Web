"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import SchemeCard from '@/components/scheme/SchemeCard';
import { SCHEME_TABS } from '@/lib/constants/index-constants';
import { CATEGORY_SCHEMES, MINISTRY_SCHEMES, STATE_SCHEMES } from '@/lib/constants/scheme-constants';
import React, { useState } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("Categories");
  return (
    <div className='flex flex-1 overflow-hidden'>
        <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={SCHEME_TABS}>

        {SCHEME_TABS && <>
        {activeTab === "Categories" && (
            <div className=" flex flex-col items-center">
            <h1 className="text-3xl font-bold p-4">Find schemes based on Categories</h1>
            <div className="flex flex-wrap gap-5 justify-center p-2">
              {CATEGORY_SCHEMES.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  icon={scheme.icon}
                  count={scheme.count}
                  title={scheme.title}
                  colorClass={scheme.colorClass}
                />
              ))}
            </div>
          </div>
        )}
        {activeTab === "State/UTs" && (
            <div className="animate-fade-in flex flex-col items-center">
            <h1 className="text-3xl font-bold p-4">Find schemes based on States/UTs</h1>
            <div className="flex flex-wrap gap-5 justify-center p-2">
            {STATE_SCHEMES.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  icon={scheme.icon}
                  count={scheme.count}
                  title={scheme.title}
                  colorClass={scheme.colorClass}
                />
              ))}
            </div>
          </div>
        )}
        {activeTab === "Central Ministeries" && (
            <div className="animate-fade-in flex flex-col items-center">
            <h1 className="text-3xl font-bold p-4">Find schemes based on Central Ministeries</h1>
            <div className="flex flex-wrap gap-5 justify-center p-2">
              {MINISTRY_SCHEMES.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  icon={scheme.icon}
                  count={scheme.count}
                  title={scheme.title}
                  colorClass={scheme.colorClass}
                />
              ))}
            </div>
          </div>
        )}
      </>}
      </ContentFeed>
    </div>
  )
}

export default Page