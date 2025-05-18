"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import SchemeCard from '@/components/scheme/SchemeCard';
import { SCHEME_TABS } from '@/lib/constants/index-constants';
import { SchemeAnalyticsResponse } from '@/service/api.interface';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [activeTab, setActiveTab] = useState("Categories");
    const [tabs, setTabs] = useState<SchemeAnalyticsResponse | null>(null);

    // Helper function to find icon for a scheme by label/id
    
    const getTabs = async () => {
        try {
            const response = await fetch('/api/scheme', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setTabs(data);
        } catch (error) {
            console.error("Error fetching scheme data:", error);
        }
    }

    useEffect(() => {
        getTabs();
    }, []);

    const categoryData = tabs?.data.categoryWise || [];
    const stateData = tabs?.data.stateWise || [];
    const ministryData = tabs?.data.ministryWise || [];

    return (
        <div className='flex flex-1 overflow-hidden'>
            <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={SCHEME_TABS}>

            {SCHEME_TABS && <>
                {activeTab === "Categories" && (
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl md:text-2xl font-bold p-4">Find schemes based on Categories</h1>
                        <div className="flex flex-wrap gap-4 justify-center p-2">
                            {categoryData.map((scheme, index) => (
                                <SchemeCard
                                    key={index}
                                    icon={scheme.icon}
                                    count={scheme.count}
                                    label={scheme.label}
                                    type='category'
                                />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "State/UTs" && (
                    <div className="animate-fade-in flex flex-col items-center">
                        <h1 className="text-xl md:text-2xl font-bold p-4">Find schemes based on States/UTs</h1>
                        <div className="flex flex-wrap gap-5 justify-center p-2">
                            {stateData.map((scheme, index) => (
                                <SchemeCard
                                    key={index}
                                    icon={scheme.icon}
                                    type='state'
                                    count={scheme.count}
                                    label={scheme.label}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "Central Ministeries" && (
                    <div className="animate-fade-in flex flex-col items-center">
                        <h1 className="text-xl md:text-2xl font-bold p-4">Find schemes based on Central Ministeries</h1>
                        <div className="flex flex-wrap gap-4 justify-center p-2">
                            {ministryData.map((scheme, index) => (
                                <SchemeCard
                                    key={index}
                                    icon={scheme.icon}
                                    count={scheme.count}
                                    label={scheme.label}
                                    type='ministry'
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