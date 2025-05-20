"use client";
import React, { useState } from "react";
import { Search, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SETTINGS_OPTIONS } from "@/lib/constants/settings-constants";
import ChangePassword from "./ChangePassword";
import Deactivate from "./Deactivate";
import Sessions from "./Sessions";
import { Switch } from "../ui/switch";

interface SettingsProps {
    className?: string;
}

const Settings: React.FC<SettingsProps> = ({ className }) => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleSelectSetting = (id: string) => {
        setActiveSection(id === activeSection ? null : id);
    };

    const handleBackToSettings = () => {
        setActiveSection(null);
    };

    const filteredItems = SETTINGS_OPTIONS;

    const activeItem = activeSection
        ? SETTINGS_OPTIONS.find((item) => item.id === activeSection)
        : null;

    return (
        <div className="flex flex-col md:flex-row w-full h-full">
            <div
                className={cn(
                    "h-full border-r bg-white transition-all duration-300 ease-in-out",
                    activeSection ? "md:w-1/2 w-full" : "w-full",
                    activeSection && "hidden md:block", // Hide on mobile when activeSection exists
                    className
                )}
                style={{
                    animation: activeSection
                        ? "slideWidth 0.3s ease-in-out forwards"
                        : "expandWidth 0.3s ease-in-out forwards",
                }}
            >
                <div className="p-2 border-b flex items-center space-x-2 mb-2">
                    <ArrowLeft
                        size={25}
                        className="cursor-pointer block lg:hidden"
                        onClick={() => window.location.href = "/"}
                    />
                    <h1 className="text-xl font-semibold ">
                        Settings & Help Center
                    </h1>
                </div>

                <div className="">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100",
                                activeSection === item.id &&
                                    "bg-[#19486A]/15 border-r-2 border-[#19486A] text-[#19486A]"
                            )}
                            onClick={() => handleSelectSetting(item.id)}
                        >
                            <span className="text-md font-semibold">
                                {item.label}
                            </span>
                            <ChevronRight
                                size={18}
                                className={cn(
                                    "text-gray-400",
                                    activeSection === item.id &&
                                        "transform rotate-90 transition-transform"
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* SubOptions Panel */}
            {activeSection && activeItem?.subOptions && (
                <div
                    className={cn(
                        "w-full h-full bg-white border-l p-4 md:p-6 animate-slide-in-right"
                    )}
                >
                    <div className="flex items-center mb-4">
                        <button
                            aria-label="back"
                            className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                            onClick={handleBackToSettings}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-semibold">
                            {activeItem.label}
                        </h2>
                    </div>
                    <p className="text-gray-600 mb-6">
                        {activeItem.description}
                    </p>

                    <div className="space-y-4">
                        {activeItem.subOptions.map((subOption) => (
                            <div
                                key={subOption.id}
                                className="p-3 rounded-md hover:bg-gray-100 cursor-pointer transition-colors flex items-center justify-between"
                                onClick={
                                    subOption?.sessionTab
                                        ? () =>
                                              handleSelectSetting(
                                                  subOption?.sessionTab || ""
                                              )
                                        : undefined
                                }
                            >
                                <div>
                                    <h3 className="font-medium">
                                        {subOption.label}
                                    </h3>
                                    {subOption?.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {subOption?.description}
                                        </p>
                                    )}
                                </div>
                                {activeItem?.isToggle ? (
                                    <Switch className="text-gray-400" />
                                ) : (
                                    <ChevronRight
                                        size={20}
                                        className="text-gray-400"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection && !activeItem?.subOptions && (
                <div className="w-full h-full">
                    {activeSection == "Change_Passord" && (
                        <div className="md:pl-0 w-full">
                            <ChangePassword onBack={handleBackToSettings} />
                        </div>
                    )}
                    {activeSection == "Deactivate" && (
                        <div className="md:pl-0 w-full">
                            <Deactivate onBack={handleBackToSettings} />
                        </div>
                    )}
                    {activeSection == "Sessions" && (
                        <div className="md:pl-0 w-full">
                            <Sessions onBack={handleBackToSettings} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Settings;
