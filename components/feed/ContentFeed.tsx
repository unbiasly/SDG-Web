import React, { ReactNode } from 'react';

type ContentFeedProps = {
    activeTab: string;
    defaultTab?: string;
    setActiveTab: (tab: string) => void;
    tabs: string[];
    children: ReactNode;  // Add children prop to render content
}

export const ContentFeed: React.FC<ContentFeedProps> = ({ 
    activeTab, 
    setActiveTab, 
    tabs,
    children 
}) => {
    return (
        <div className="w-full bg-white md:rounded-2xl md:border-1 border-gray-300">
            {/* Tab Navigation */}
            <div className="border-b border-gray-300 mb-0.5">
                <div className="flex w-full justify-evenly">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={tab}>
                            <div className={`py-2 ${
                                activeTab === tab 
                                    ? 'border-b-3 border-b-accent text-accent  active' 
                                    : 'border-b-2 text-gray-400 border-b-transparent'
                            }`}>
                                <button
                                    className={`flex cursor-pointer justify-center text-md md:text-xl  ${activeTab === tab ? 'font-bold' : 'text-gray-400'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            </div>
                            {index < tabs.length - 1 && (
                                <div className="my-2 border-r border-l border-gray-300 rounded-full" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="content-area">
                {children}
            </div>
        </div>
    );
};