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
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: "0px",
        width: "0px",
    });

    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Update indicator position when activeTab changes
    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        if (activeTabElement) {
            setIndicatorStyle({
                left: `${activeTabElement.offsetLeft}px`,
                width: `${activeTabElement.offsetWidth}px`,
            });
        }
    }, [activeTab]);

    const tabLength = useMemo(() => tabs.length, [tabs]);

    return (
        <div className={cn("relative border-b border-gray-300", className)}>
            <div className={`flex justify-evenly ${tabLength >= 3 ? "w-full" : "w-1/3"}`}>
                {tabs.map((tab, index) => (
                    <React.Fragment key={tab.id}>
                        <div
                            className={` py-2  ${
                                activeTab === tab.id
                                    ? "border-b-2 font-bold text-accent border-b-accent active"
                                    : "border-b-2 border-b-transparent"
                            }`}
                        >
                            <button
                                className="flex justify-start text-base md:text-xl  cursor-pointer"
                                onClick={() => onChange(tab.id)}
                            >
                                {tab.label}
                            </button>
                        </div>
                        {index < tabs.length - 1 && (
                            <div className=" my-1.5 border-r border-l mx-4 border-gray-300 rounded-full"/>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ProfileTabs;
