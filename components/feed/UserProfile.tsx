"use client";
import React, { useMemo } from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { PROFILE_OPTIONS } from "@/lib/constants/index-constants";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@/lib/redux/features/user/hooks";
import ProfileAvatar from "../profile/ProfileAvatar";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";

export const UserSidebar = () => {
    const pathname = usePathname();
    const { user } = useUser(); // Consider adding clearUser from Redux if needed

    // Check if essential user data has loaded
    const isDataLoaded = useMemo(() => {
        return Boolean(user && user.username);
    }, [user]);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
            });

            if (response.ok) {
                console.log(
                    "Logout API call successful, redirecting to login."
                );
            } else {
                const errorText = await response.text();
                console.error(
                    "Logout API call failed but proceeding with redirect:",
                    response.status,
                    errorText
                );
            }
        } catch (error: any) {
            console.error("Error during frontend logout call:", error.message);
        }
        // Always redirect to login page after attempting logout
        window.location.href = "/login";
    };

    // Navigation items for both desktop and mobile
    const renderNavItems = (isMobile = false) => (
        <div className={`
            ${isMobile 
                ? 'flex-1 overflow-y-auto' 
                : 'flex-1 overflow-y-auto max-h-[calc(100vh-300px)] lg:min-h-0'
            } hidden-scrollbar
        `}>
            <ul className="space-y-1 pr-2">
                {PROFILE_OPTIONS.map((option, key) => {
                    let route = option.route;

                    if (option.routeGenerator && user?._id) {
                        route = option.routeGenerator(user._id);
                    }

                    const isActive =
                        pathname === route ||
                        (pathname.startsWith("/profile/") &&
                            option.label === "Profile");

                    return (
                        <SidebarItem
                            key={key}
                            isActive={isActive}
                            route={route || "#"}
                            icon={option.icon}
                            label={option.label}
                            isMobile={isMobile}
                        />
                    );
                })}
                <li>
                    <div className="flex flex-col w-full">
                        {isMobile ? (
                            <SheetClose asChild>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-start cursor-pointer space-x-2 p-2 rounded-xl hover:bg-accent/30 w-full"
                                >
                                    <LogOut className="m-0" />
                                    <span className="text-md font-regular ml-2">
                                        Logout
                                    </span>
                                </button>
                            </SheetClose>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-start cursor-pointer space-x-2 p-2 rounded-xl hover:bg-accent/30 w-full"
                            >
                                <LogOut className="m-0" />
                                <span className="text-md font-regular ml-2 hidden lg:block">
                                    Logout
                                </span>
                            </button>
                        )}
                    </div>
                </li>
            </ul>
        </div>
    );

    // User profile section for both desktop and mobile
    const renderUserProfile = () => (
        <div className="flex-col w-full py-2 items-center md:items-start border-b border-gray-600 flex flex-shrink-0">
            <div className="relative mb-2 w-20">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                    {isDataLoaded ? (
                        <ProfileAvatar
                            src={user?.profileImage || ""}
                            className="object-contain"
                            size="profile"
                            userName={user?.name || user?.username}
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded-full"></div>
                    )}
                </div>
                <button
                    aria-label="online status"
                    className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                >
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </button>
            </div>

            {isDataLoaded ? (
                <div >
                    <h3 className="font-semibold text-lg ">
                        {user?.name}
                    </h3>
                    <Link href={`/profile/${user?._id}`} className="text-sm text-gray-500 hover:underline">
                        @{user?.username}
                    </Link>
                </div>
            ) : (
                <>
                    <div className="h-6 w-full flex-wrap bg-gray-200 animate-pulse rounded-md mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md mb-1"></div>
                </>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="w-full flex-1 bg-white border-1 border-gray-300 p-4 rounded-2xl md:flex flex-col max-h-full hidden">
                <Link
                    href="/"
                    className="justify-center items-center gap-2 pb-2 flex lg:hidden flex-shrink-0"
                >
                    <Image
                        src="/Logo.svg"
                        alt="SDG Logo"
                        width={35}
                        height={35}
                    />
                </Link>

                <div className="flex-col items-start  hidden lg:flex flex-shrink-0">
                    {renderUserProfile()}
                </div>

                <nav className="lg:pt-2 hidden md:flex flex-col flex-1 min-h-0">
                    {renderNavItems()}
                </nav>
            </div>

            {/* Mobile Menu - Visible only on screens below md */}
            <div className="block md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <button
                            aria-label="open-menu"
                            className="p-2 cursor-pointer rounded-lg hover:bg-gray-100"
                        >
                            <Image
                                src="/Logo.svg"
                                alt="SDG Logo"
                                width={35}
                                height={35}
                            />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="h-full p-4 rounded-r-xl w-fit md:hidden flex flex-col"
                    >
                        <SheetHeader className="mb-4 flex-shrink-0">
                            <SheetTitle className="flex items-center justify-center">
                                <Image
                                    src="/Logo.svg"
                                    alt="SDG Logo"
                                    width={35}
                                    height={35}
                                />
                                <span className="ml-2 text-lg font-bold">
                                    The SDG Story
                                </span>
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex-shrink-0">
                            {renderUserProfile()}
                        </div>

                        <nav className="mt-4 w-full flex-1 min-h-0 flex flex-col">
                            {renderNavItems(true)}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

interface SidebarItemProps {
    icon: string;
    label: string;
    isActive?: boolean;
    route: string;
    showLabel?: boolean;
    isMobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    label,
    isActive,
    route,
    showLabel,
    isMobile,
}) => {
    const linkContent = (
        <Link
            href={route}
            className={`flex w-full lg:w-full items-center justify-start space-x-2 py-2 p-2 rounded-xl hover:bg-accent/30 ${
                isActive ? "font-bold text-accent" : ""
            }`}
        >
            <Image
                src={icon}
                alt={label}
                className="object-fill m-0"
                width={25}
                height={25}
            />
            <span
                className={`text-md font-regular ml-2 block md:hidden lg:block`}
            >
                {label}
            </span>
        </Link>
    );

    return (
        <li>
            <div className="flex w-full flex-col">
                {isMobile ? (
                    <SheetClose asChild>{linkContent}</SheetClose>
                ) : (
                    linkContent
                )}
            </div>
        </li>
    );
};
