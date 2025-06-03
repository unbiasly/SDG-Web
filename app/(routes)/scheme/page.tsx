"use client"
import { ContentFeed } from '@/components/feed/ContentFeed'
import Loader from '@/components/Loader';
import SchemeCard from '@/components/scheme/SchemeCard';
import { SCHEME_TABS } from '@/lib/constants/index-constants';
import { SchemeAnalyticsResponse } from '@/service/api.interface';
import React, { useEffect, useState } from 'react'

// Interface for tab configuration
interface SchemeDataItem {
  icon: string;
  count: number;
  label: string;
  [key: string]: any;
}

interface TabConfigItem {
  title: string;
  data: SchemeDataItem[];
  type: "category" | "state" | "ministry";
}

interface TabConfig {
  [key: string]: TabConfigItem;
}

const Page = () => {
    const [activeTab, setActiveTab] = useState<string>("Categories");
    const [tabs, setTabs] = useState<SchemeAnalyticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

    // Helper function to find icon for a scheme by label/id
    
    const getTabs = async () => {
        setIsLoading(true); // Set loading to true when fetching starts
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
        } finally {
            setIsLoading(false); // Set loading to false when fetching ends
        }
    }

    useEffect(() => {
        getTabs();
    }, []);

    const categoryData = tabs?.data?.categoryWise || [];
    const stateData = tabs?.data?.stateWise || [];
    const ministryData = tabs?.data?.ministryWise || [];

    // Tab configuration mapping with proper typing
    const tabConfig: TabConfig = {
        "Categories": {
            title: "Find schemes based on Categories",
            data: categoryData,
            type: "category"
        },
        "State/UTs": {
            title: "Find schemes based on States/UTs",
            data: stateData,
            type: "state"
        },
        "Central Ministeries": {
            title: "Find schemes based on Central Ministeries",
            data: ministryData,
            type: "ministry"
        }
    };

    // Check if we have actual data to display
    const hasData = tabs?.data && Object.keys(tabs.data).length > 0;


    return (
        <div className='flex flex-1 overflow-hidden'>
            <ContentFeed activeTab={activeTab} setActiveTab={setActiveTab} tabs={SCHEME_TABS}>
                {isLoading ? (
                    <div className="w-full flex justify-center items-center p-8">
                        <Loader />
                    </div>
                ) : (
                    SCHEME_TABS && activeTab && tabConfig[activeTab] && hasData ? (
                        <div className="w-full animate-fade-in">
                            <h1 className="text-xl md:text-2xl font-bold p-2 md:p-4 text-center">
                                {tabConfig[activeTab].title}
                            </h1>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-5"> {/* Changed from flex to grid */}
                                {tabConfig[activeTab].data.map((scheme, index) => (
                                    <div key={index} className="flex justify-center  mb-3">
                                        <SchemeCard
                                            icon={scheme.icon}
                                            count={scheme.count}
                                            label={scheme.label}
                                            type={tabConfig[activeTab].type}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center items-center p-8">
                            <p className="text-gray-500">No scheme data available.</p>
                        </div>
                    )
                )}
            </ContentFeed>
        </div>
    );
}

export default Page