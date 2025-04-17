'use client'
import { ArticleCard, Article } from '@/components/feed/SDGNews';
import PersonCard, { User } from '@/components/profile/PersonCard';
import { SEARCH_RESULT_CATEGORIES } from '@/lib/constants/index-constants';
import { ArrowLeft, Search } from 'lucide-react';
import React, { useState } from 'react'

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("Goal 1");
    const [activeTab, setActiveTab] = useState(SEARCH_RESULT_CATEGORIES[0]);
    
    // Mock users list that follows the User interface
    const users = [
      {
        _id: "user1",
        username: "johndoe",
        name: "John Doe",
        occupation: "Software Engineer",
        profileImage: "/lovable-uploads/9921df0a-1129-4b97-aa94-8cbfbb058f0d.png",
        email: "john.doe@example.com",
        following: true
      },
      {
        _id: "user2",
        username: "janesmith",
        name: "Jane Smith",
        occupation: "Project Manager",
        profileImage: "/lovable-uploads/9921df0a-1129-4b97-aa94-8cbfbb058f0d.png",
        email: "jane.smith@example.com",
        following: false
      },
      {
        _id: "user3",
        username: "alexjohnson",
        name: "Alex Johnson",
        occupation: "UX Designer",
        profileImage: "/lovable-uploads/9921df0a-1129-4b97-aa94-8cbfbb058f0d.png",
        email: "alex.johnson@example.com",
        following: false
      },
      {
        _id: "user4",
        username: "marialiu",
        name: "Maria Liu",
        occupation: "Data Scientist",
        profileImage: "/lovable-uploads/9921df0a-1129-4b97-aa94-8cbfbb058f0d.png",
        email: "maria.liu@example.com",
        following: true
      },
      {
        _id: "user5",
        username: "davidpatel",
        name: "David Patel",
        occupation: "Product Manager",
        profileImage: "/lovable-uploads/9921df0a-1129-4b97-aa94-8cbfbb058f0d.png",
        email: "david.patel@example.com",
        following: false
      }
    ];
    
    // Mock articles list that follows the Article interface
    const articles: Article[] = [
      {
        _id: "article1",
        title: "MOU Signed Between Government of West Bengal and UNDP to Strengthen Collaboration for Development",
        publisher: "UNDP India",
        link: "https://example.com/article1",
        isBookmarked: false,
        createdAt: "2023-08-15T10:30:00Z",
        updatedAt: "2023-08-15T14:20:00Z"
      },
      {
        _id: "article2",
        title: "Climate Action: New Initiatives for Sustainable Development Goals",
        publisher: "UN Environment",
        link: "https://example.com/article2",
        isBookmarked: true,
        createdAt: "2023-08-10T09:15:00Z",
        updatedAt: "2023-08-11T11:45:00Z"
      },
      {
        _id: "article3",
        title: "Global Partnership for Education Launches New Strategy",
        publisher: "UNESCO",
        link: "https://example.com/article3",
        isBookmarked: false,
        createdAt: "2023-08-05T16:20:00Z",
        updatedAt: "2023-08-06T08:30:00Z"
      }
    ];
    
    // Mock follow mutation object
    const followMutation = {
      isPending: false,
      variables: undefined
    };
    
    // Handler for follow/unfollow toggle
    const handleFollowToggle = (user: User) => {
      console.log(`Toggle follow for user: ${user.name}`);
      // In a real app, you would update the user's following status here
    };

  return (
    <div className='flex flex-col flex-1 overflow-hidden p-4'>
        <div className="flex w-full h-fit items-center mb-2">
            <ArrowLeft size={30} className='mr-5 cursor-pointer'/>
            <div className="w-full h-fit mx-auto relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-600 py-2 px-4 rounded-full text-lg "
                    placeholder="Search..."
                />
                <Search color='black' className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-300 mb-4">
            <div className="flex w-full justify-evenly">
                {SEARCH_RESULT_CATEGORIES.map((tab, index) => (
                    <React.Fragment key={index}>
                        <div className={`py-2 ${
                            activeTab === tab 
                                ? 'border-b-2 border-b-accent text-accent font-bold' 
                                : 'border-b-2 text-gray-400 border-b-transparent'
                        }`}>
                            <button
                                className="flex cursor-pointer justify-center text-xl"
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.label}
                            </button>
                        </div>
                        {index < SEARCH_RESULT_CATEGORIES.length - 1 && (
                            <div className="my-2 border-r border-l border-gray-300 rounded-full" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
            {activeTab === SEARCH_RESULT_CATEGORIES[0] && (
                // <div>
                //     {/* Content for first tab */}
                //     <p className="text-gray-500">No results found for "{searchQuery}" in {activeTab.label}</p>
                // </div>
                <div className="mx-auto py-8 space-y-12">
                    {/* People Section */}
                    <section>
                    <h2 className="text-accent text-2xl font-bold mb-6">People</h2>
                    <div className="space-y-4">
                        {users.map(user => (
                        <PersonCard
                            key={user._id}
                            user={user}
                            handleFollowToggle={handleFollowToggle}
                            followMutation={followMutation}
                        />
                        ))}
                    </div>
                    </section>

                    {/* News Section */}
                    <section>
                    <h2 className="text-accent text-2xl font-bold mb-6">News</h2>
                    <div className="space-y-4">
                        {articles.map(article => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                        />
                        ))}
                    </div>
                    </section>

                    {/* Schemes Section */}
                    <section>
                    <h2 className="text-accent text-2xl font-bold mb-6">Schemes</h2>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Assistance under SC/ST Prevention of Atrocities Act</h3>
                        <p className="text-gray-600 leading-relaxed">The scheme 'Assistance under SC/ST Prevention of Atrocities Act' was introduced by the Adi Dravidar Welfare Department, Government of Puducherry. The objective of the scheme is to...</p>
                    </div>
                    </section>
                </div>
            )}
            {activeTab === SEARCH_RESULT_CATEGORIES[1] && (
                <div>
                    {/* Content for second tab */}
                    <p className="text-gray-500">No results found for "{searchQuery}" in {activeTab.label}</p>
                </div>
            )}
            {/* Add similar blocks for other tabs */}
        </div>

        
    </div>
  )
}

export default Page