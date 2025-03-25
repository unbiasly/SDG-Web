import React from 'react';
import { PostCard } from './PostCard';
import TSSNews from './SDGNews';
import CreatePost from './CreatePost';
import { FEED_TABS, NOTIFICATION_TABS, SCHEME_TABS } from '@/lib/constants/index-constants';
import NotificationList from '../notification/NotificationList'
import { CATEGORY_SCHEMES, MINISTRY_SCHEMES, STATE_SCHEMES } from '@/lib/constants/scheme-constants';
import SchemeCard from '../scheme/SchemeCard';


type ContentFeedProps = {
    activeTab: string,
    defaultTab?: string,
    setActiveTab: (tab: string) => void,
    tabs: string[],
    
}


export const ContentFeed: React.FC<ContentFeedProps> = ({ defaultTab, activeTab = defaultTab, setActiveTab,  tabs }) => {
    
  return (
    <div className="w-full bg-white rounded-sm border-1 border-gray-300">

      <div className="border-b border-gray-300 mb-0.5">
        <div className="flex w-full justify-evenly ">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
              <div className={` py-2  ${activeTab === tab ? 'border-b-2 border-b-black active' : 'border-b-2 border-b-transparent'}`}>
                <button
                  className="flex justify-center text-xl font-medium cursor-pointer"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </div>
              {index < tabs.length - 1 && <div className=" my-2 border-r border-l border-gray-300 rounded-full"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {FEED_TABS && (
        <>
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
          {activeTab === "The SDG News" && <TSSNews />}
        </>
      )}
      {NOTIFICATION_TABS && <NotificationList activeTab={activeTab || ''} />}
      {SCHEME_TABS && <>
        {activeTab === "Categories" && (
            <div className="animate-fade-in flex flex-col items-center">
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

    </div>




  );
};