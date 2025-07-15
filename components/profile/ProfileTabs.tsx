"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

interface TabProps {
    id: string;
    label: string;
}

interface ProfileTabsProps {
    tabs: TabProps[];
    activeTab: string;
    onChange: (tabId: string) => void;
    className?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className,
}) => {
    const tabLength = useMemo(() => tabs.length, [tabs]);

    return (
        <div className={cn("relative border-b border-gray-300", className)}>
            <div className="flex w-full overflow-x-auto hidden-scrollbar ">
                <div className="flex w-full ">
                    {tabs.map((tab, index) => (
                        <React.Fragment key={tab.id}>
                            <div
                                className={`flex-shrink-0 py-2 ${
                                    activeTab === tab.id
                                        ? "border-b-2 fonts-semibold lg:font-bold text-accent border-b-accent active"
                                        : ""
                                }`}
                                // style={{
                                //     minWidth: `${100 / Math.min(tabLength, 4)}%`,
                                //     maxWidth: tabLength > 4 ? 'auto' : `${100 / tabLength}%`
                                // }}
                            >
                                <button
                                    className="flex justify-center items-center text-base lg:text-xl cursor-pointer w-full px-1 md:px-2 py-1 whitespace-nowrap"
                                    onClick={() => onChange(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </div>
                            {index < tabs.length - 1 && (
                                <div className="flex-shrink-0 my-1.5 border-r border-l mx-2 md:mx-4 border-gray-300 rounded-full"/>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileTabs;
