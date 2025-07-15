"use client";
import React, { use, useEffect, useMemo, useState, useCallback } from "react";
import Loader from "@/components/Loader";
import { Camera, Eye, FileUp, LinkIcon, Plus, X } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileAnalyticsCard from "@/components/profile/ProfileAnalyticsCard";
import {
    PROFILE_ANALYTICS,
    USER_PROFILE_TABS,
    SOCIETY_PROFILE_TABS,
    SOCIETY_ADMIN_PROFILE_TABS,
} from "@/lib/constants/index-constants";
import { useUser } from "@/lib/redux/features/user/hooks";
import {
    AnalyticsResponseData,
    Education,
    PostsFetchResponse,
    UserData,
    Experience,
    Event,
} from "@/service/api.interface";
import { PostCard } from "@/components/feed/PostCard";
import { UserProfileDialog } from "@/components/userDataDialogs/ProfileDialog";
import Link from "next/link";
import { formatDate } from "@/lib/utilities/formatDate";
import Image from "next/image";
import { CareerSection } from "@/components/profile/CareerSection";
import ExperienceCard from "@/components/profile/ExperienceCard";
import EducationCard from "@/components/profile/EducationCard";
import { EducationDialog } from "@/components/userDataDialogs/EducationDialog";
import { ExperienceDialog } from "@/components/userDataDialogs/ExperienceDialog";
import FollowButton from "@/components/profile/FollowButton";
import ProfileImageDialog from "@/components/userDataDialogs/ProfileImageDialog";
import BackgroundImageDialog from "@/components/userDataDialogs/BackgroundImageDialog";
import ProfileImageView from "@/components/profile/ProfileImageView";
import BackgroundImageView from "@/components/profile/BackgroundImageView";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AppApi } from "@/service/app.api";
import { CreateEvent } from "@/components/events/EventCreateForm";
import CompleteProfileForm from "@/components/profile/CompleteProfileForm";
import SocietyMemberCard from "@/components/society/SocietyMemberCard";
import SocietyRequestCard from "@/components/society/SocietyRequestCard";
import ProfileEventCard from "@/components/events/ProfileEventCard";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AddMemberForm } from "@/components/society/AddMemberForm";
import VerifiedRole from "@/components/custom-ui/VerifiedRole";

export default function Page({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = use(params);
    const { user } = useUser();
    const queryClient = useQueryClient();

    // State declarations - consolidated
    const [activeProfileTab, setActiveProfileTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("activeProfileTab") || "about";
        }
        return "about";
    });

    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsResponseData | null>(null);
    
    // Loading and UI states
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
    const [fetchAttempts, setFetchAttempts] = useState(0);
    const [isUploadingCSV, setIsUploadingCSV] = useState(false);
    
    // Dialog states
    const [isFollowingActive, setIsFollowingActive] = useState(false);
    const [isProfileImageViewOpen, setIsProfileImageViewOpen] = useState(false);
    const [isBackgroundImageViewOpen, setIsBackgroundImageViewOpen] = useState(false);
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    
    // Selected items
    const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
    const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState<number | undefined>(undefined);
    const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | undefined>(undefined);

    // Memoized computed values - PREVENT RECALCULATION
    const isOwnProfile = useMemo(() => {
        return user?._id === profileUser?._id;
    }, [user?._id, profileUser?._id]);

    const isSocietyProfile = useMemo(() => {
        return profileUser?.role_slug === "sdg-society";
    }, [profileUser?.role_slug]);

    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const avatarSize = isSmallScreen ? "lg" : "xl";

    // Memoized API functions - PREVENT RECREATION
    const fetchUserById = useCallback(async (id: string, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000;

        if (retryCount === 0) {
            setIsLoading(true);
            setFetchAttempts(0);
        }
        setFetchAttempts(retryCount + 1);

        try {
            const response = await AppApi.fetchUser(id);

            if (!response.success) {
                throw new Error("User not found");
            }

            const userData = response.data;
            if (userData?.data) {
                // BATCH STATE UPDATES - PREVENT MULTIPLE RE-RENDERS
                setProfileUser(userData.data);
                setIsFollowingActive(userData.data.isFollowing);
                setFetchAttempts(0);
                return userData.data;
            }
            
            throw new Error("No user data received");
        } catch (error) {
            console.error(`Failed to fetch user by ID (attempt ${retryCount + 1}):`, error);
            
            if (retryCount < MAX_RETRIES && (error as any)?.status === 401) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                setIsTokenRefreshing(true);
                
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                
                setIsTokenRefreshing(false);
                return await fetchUserById(id, retryCount + 1);
            }
            
            return null;
        } finally {
            if (retryCount === 0) {
                setIsLoading(false);
                setIsTokenRefreshing(false);
            }
        }
    }, []); // No dependencies to prevent recreation

    const trackProfileView = useCallback(async (targetUserId: string) => {
        // Don't track if viewing own profile
        if (user?._id === targetUserId) return;

        try {
            await fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "track",
                    userId: targetUserId,
                    type: "profile_view",
                    viewerId: user?._id,
                }),
            });
        } catch (error) {
            console.error("Failed to track profile view:", error);
        }
    }, [user?._id]);

    const getAnalytics = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/analytics`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "get",
                    userId: userId,
                    startDate: "2025-03-15",
                    endDate: "2025-04-15",
                }),
            });
            
            const analyticsData = await response.json();
            setAnalytics(analyticsData);
        } catch (error) {
            console.error("Analytics Fetch Error:", error);
        }
    }, [userId]); // Only depend on userId

    const getSocietyEvents = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await AppApi.getEvents("event", undefined, userId);
            const eventsData = response.data;
            setEvents(eventsData.data);
        } catch (error) {
            console.error("Failed to fetch society events:", error);
        }
    }, [userId]); // Only depend on userId

    // MAIN DATA FETCHING EFFECT - OPTIMIZED
    useEffect(() => {
        if (!userId) return;

        let isCancelled = false; // Prevent state updates if component unmounts

        const fetchAllData = async () => {
            try {
                // Fetch user data first
                const userData = await fetchUserById(userId);
                
                if (isCancelled) return;

                // Track profile view for other users
                if (userData && user?._id !== userId) {
                    trackProfileView(userId);
                }

                // Fetch analytics for own profile
                if (userData && user?._id === userData._id) {
                    await getAnalytics();
                }

                // Fetch society events if it's a society profile
                if (userData?.role_slug === "sdg-society") {
                    await getSocietyEvents();
                }

                // Scroll to top after all data is loaded
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchAllData();

        return () => {
            isCancelled = true; // Cleanup function
        };
    }, [userId, isUpdated, fetchUserById, trackProfileView, getAnalytics, getSocietyEvents, user?._id]);

    // SEPARATE EFFECT FOR LOCAL STORAGE - PREVENT UNNECESSARY API CALLS
    useEffect(() => {
        if (typeof window !== "undefined" && !isSocietyProfile) {
            localStorage.setItem("activeProfileTab", activeProfileTab);
        }
    }, [activeProfileTab, isSocietyProfile]);

    // OPTIMIZED INFINITE QUERIES WITH BETTER DEPENDENCY MANAGEMENT
    const {
        data: postsData,
        fetchNextPage: fetchNextPostsPage,
        hasNextPage: hasNextPostsPage,
        isFetchingNextPage: isFetchingNextPostsPage,
        isLoading: isLoadingPosts,
        isError: isPostsError,
    } = useInfiniteQuery({
        queryKey: ["userPosts", userId],
        queryFn: async ({ pageParam = "" }) => {
            const response = await AppApi.fetchUserPosts(userId, pageParam);
            return response.data;
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor || undefined,
        initialPageParam: "",
        enabled: !!userId && activeProfileTab === "posts", // Only fetch when needed
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const {
        data: membersData,
        fetchNextPage: fetchNextMembersPage,
        hasNextPage: hasNextMembersPage,
        isFetchingNextPage: isFetchingNextMembersPage,
        isLoading: isLoadingMembers,
        isError: isMembersError,
    } = useInfiniteQuery({
        queryKey: ["societyMembers", userId],
        queryFn: async ({ pageParam = null }) => {
            const response = await AppApi.getSocietyMembers(30, pageParam as string | null);
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch society members");
            }
            return response.data;
        },
        getNextPageParam: (lastPage: any) => {
            if (lastPage?.pagination?.hasMore && lastPage?.pagination?.nextCursor) {
                return lastPage.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: null,
        enabled: !!userId && isSocietyProfile && isOwnProfile && activeProfileTab === "members", // Only fetch when needed
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const {
        data: requestsData,
        fetchNextPage: fetchNextRequestsPage,
        hasNextPage: hasNextRequestsPage,
        isFetchingNextPage: isFetchingNextRequestsPage,
        isError: isRequestsError,
    } = useInfiniteQuery({
        queryKey: ["societyRequests", userId],
        queryFn: async ({ pageParam = "" }) => {
            const response = await AppApi.getSocietyRequests(30, pageParam as string);
            return response.data;
        },
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor || undefined,
        initialPageParam: "",
        enabled: !!userId && isSocietyProfile && isOwnProfile && activeProfileTab === "requests", // Only fetch when needed
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // Memoized data arrays - PREVENT UNNECESSARY CALCULATIONS
    const allPosts = useMemo(() => {
        return postsData?.pages.flatMap((page: any) => page?.data || []) || [];
    }, [postsData]);

    const allMembers = useMemo(() => {
        return membersData?.pages.flatMap((page: any) => page?.data || []) || [];
    }, [membersData]);

    const allRequests = useMemo(() => {
        return requestsData?.pages.flatMap((page: any) => page?.data || []) || [];
    }, [requestsData]);

    // OPTIMIZED EVENT HANDLERS - PREVENT RECREATION
    const handleAddEducation = useCallback(() => {
        setSelectedEducation(undefined);
        setEducationDialogOpen(true);
    }, []);

    const handleEditEducation = useCallback((education: Education, index: number) => {
        setSelectedEducation(education);
        setSelectedEducationIndex(index);
        setEducationDialogOpen(true);
    }, []);

    const handleAddExperience = useCallback(() => {
        setSelectedExperience(undefined);
        setExperienceDialogOpen(true);
    }, []);

    const handleEditExperience = useCallback((experience: Experience, index: number) => {
        setSelectedExperience(experience);
        setSelectedExperienceIndex(index);
        setExperienceDialogOpen(true);
    }, []);

    const handleCSVUpload = useCallback(async (file: File) => {
        if (!file || !file.name.endsWith(".csv") || file.size > 5 * 1024 * 1024) {
            toast.error("Please select a valid CSV file (max 5MB)");
            return;
        }

        setIsUploadingCSV(true);

        try {
            const response = await AppApi.addSocietyMember(undefined, file);

            if (response.success) {
                toast.success("CSV uploaded successfully! Members have been added.");
                queryClient.invalidateQueries({
                    queryKey: ["societyMembers"],
                    exact: false,
                });

                // Clear file input
                const fileInput = document.getElementById("csv-upload") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                toast.error(response.error || "Failed to upload CSV file");
            }
        } catch (error) {
            console.error("Error uploading CSV:", error);
            toast.error("An error occurred while uploading the CSV file");
        } finally {
            setIsUploadingCSV(false);
        }
    }, [queryClient]);

    // Enhanced loading state
    const isActuallyLoading = isLoading || isTokenRefreshing;

    if (isActuallyLoading) {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center border-gray-300 rounded-2xl border-1 pb-20">
                <Loader />
            </div>
        );
    }

    if (!profileUser && fetchAttempts > 0) {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center">
                <div className="text-xl">User not found</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-1 flex-col border-gray-300 rounded-2xl border-1 mb-5">
            {/* Header with gray background */}
            <div className="h-full aspect-[4/1] rounded-t-xl relative overflow-hidden cursor-pointer">
                {profileUser?.profileBackgroundImage ? (
                    <Image
                        src={
                            typeof profileUser.profileBackgroundImage ===
                            "string"
                                ? profileUser.profileBackgroundImage
                                : ""
                        }
                        alt="Profile background"
                        fill
                        className="object-cover"
                        priority
                        onClick={() => setIsBackgroundImageViewOpen(true)}
                    />
                ) : (
                    <Image
                        src="/Profile-BG.png"
                        alt="Default Profile background"
                        fill
                        className="object-cover"
                        priority
                        onClick={() => setIsBackgroundImageViewOpen(true)}
                    />
                )}
                <div onClick={(e) => e.stopPropagation()}>
                    {isOwnProfile && <BackgroundImageDialog />}
                </div>
            </div>

            {/* Profile header */}
            <div className="flex justify-between -mt-15 md:-mt-20 items-end px-6">
                <div className="relative cursor-pointer">
                    <ProfileAvatar
                        size={avatarSize}
                        borderColor="white"
                        src={profileUser?.profileImage || ""}
                        userName={profileUser?.name || profileUser?.username}
                        alt="Profile"
                        onClick={() => setIsProfileImageViewOpen(true)}
                    />
                    <div onClick={(e) => e.stopPropagation()}>
                        {isOwnProfile && <ProfileImageDialog />}
                    </div>
                </div>
                {isOwnProfile ? (
                    profileUser && <UserProfileDialog user={profileUser} onSuccess={() => setIsUpdated(!isUpdated)} />
                ) : (
                    <FollowButton
                        targetId={profileUser?._id}
                        userId={user?._id || ""}
                        followed={profileUser?.isFollowing}
                        onFollowChange={(isFollowing) => {
                            setIsFollowingActive(isFollowing);
                        }}
                    />
                )}
            </div>

            {/* Main content */}
            <div className="w-full px-2 relative z-5">
                {/* Profile info */}
                <div className="mt-6 space-y-1 px-4 animate-scale-in">
                    <div className="flex items-center gap-2 ">
                        <h1 className="text-2xl lg:text-3xl font-bold">
                            {profileUser?.fName && profileUser?.lName
                                ? `${profileUser.fName} ${profileUser.lName}`
                                : `@${profileUser?.username}`}
                        </h1>
                        <VerifiedRole role={profileUser?.role_slug || ''} />
                    </div>
                    <p className="text-base lg:text-xl">
                        {profileUser?.occupation || ""}
                    </p>
                    <p className="text-base lg:text-xl font-semibold">
                        {profileUser?.headline || ""}
                    </p>

                    <div className="flex gap-6 lg:my-2">
                        <Link
                            href={`/profile/${profileUser?._id}/connections?tab=followers`}
                            className="flex items-baseline gap-1 cursor-pointer"
                        >
                            <span className="text-profile-text font-semibold hover:underline">
                                {analytics?.data?.followCounts?.followerCount} Followers
                            </span>
                        </Link>
                        <Link
                            href={`/profile/${profileUser?._id}/connections?tab=following`}
                            className="flex items-baseline gap-1 cursor-pointer"
                        >
                            <span className="text-profile-text font-semibold hover:underline">
                                {analytics?.data?.followCounts?.followingCount} Following
                            </span>
                        </Link>
                    </div>

                    <div className=" lg:mt-2 text-profile-secondary">
                        <p className="mb-1">
                            {profileUser?.experience?.[0]?.role || ""}
                        </p>
                        <p className="mb-1">{profileUser?.location || ""}</p>
                        {profileUser?.portfolioLink && (
                            <Link
                                href={profileUser?.portfolioLink || ""}
                                target="_blank"
                                className="flex items-center hover:underline gap-1 mb-4"
                            >
                                <LinkIcon size={16} />
                                <span>{profileUser?.portfolioLink || ""}</span>
                            </Link>
                        )}
                        {profileUser?.bio && (
                            <div className="mb-4">
                                <p className="text-md text-gray-500">
                                    {profileUser.bio}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex  mt-4">
                    {/* <div 
                        className="flex-1 p-4 border-y-1 border-r border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative"
                        onClick={() => console.log("First partition clicked")}
                    >
                        <X className="absolute top-2 right-2 h-4 w-4 text-gray-400 hover:text-gray-600" />
                        <h3 className="font-semibold text-accent">Get Verified!</h3>
                        <p className="text-sm text-gray-600">Go Official: Verify Your Account Now</p>
                    </div> */}
                    {!profileUser?.roleRequested && isOwnProfile && (
                        <CompleteProfileForm role={profileUser?.role_slug} />
                    )}
                </div>

                {/* Tabs */}
                <ProfileTabs
                    tabs={
                        isSocietyProfile
                            ? isOwnProfile
                                ? SOCIETY_ADMIN_PROFILE_TABS
                                : SOCIETY_PROFILE_TABS
                            : USER_PROFILE_TABS
                    }
                    activeTab={activeProfileTab}
                    onChange={setActiveProfileTab}
                    className="mt-4"
                />

                {/* Tab content */}
                <div className="p-5">
                    {activeProfileTab === "about" && (
                        <div className="space-y-8  animate-fade-in">
                            {/* Analytics section - only show for own profile */}
                            {isOwnProfile && (
                                <div className="border-b py-3 space-y-3">
                                    <div className="flex items-center  gap-4">
                                        <h2 className="text-xl lg:text-2xl font-bold">
                                            Analytics
                                        </h2>
                                        <div className="flex items-center gap-1 text-sm text-profile-secondary bg-gray-300 px-2 py-1 rounded-full">
                                            <Eye  />
                                            <span>Private to you</span>
                                        </div>
                                    </div>
    
                                    <div className="grid md:grid-cols-2 justify-between gap-4 ">
                                        {PROFILE_ANALYTICS.map(
                                            (analyticsItem) => {
                                                let count = 0;
                                                if (
                                                    analyticsItem.type ===
                                                    "views"
                                                ) {
                                                    count =
                                                        analytics?.data
                                                            ?.analytics
                                                            ?.total_views || 0;
                                                } else {
                                                    count =
                                                        analytics?.data
                                                            ?.analytics
                                                            ?.total_post_impressions ||
                                                        0;
                                                }
    
                                                return (
                                                    <ProfileAnalyticsCard
                                                        key={analyticsItem.type}
                                                        type={
                                                            analyticsItem.type as
                                                                | "views"
                                                                | "impressions"
                                                        }
                                                        count={count}
                                                        description={
                                                            analyticsItem.description
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
    
                            {/* Experience section */}
                            <CareerSection
                                title="Experience"
                                onAddClick={
                                    isOwnProfile
                                        ? handleAddExperience
                                        : undefined
                                }
                                authUser={isOwnProfile}
                            >
                                {profileUser?.experience && profileUser.experience.length > 0 ? (
                                    profileUser.experience.map((exp, index) => (
                                        <div
                                            key={exp._id || index}
                                            className="relative"
                                        >
                                            <ExperienceCard
                                                position={exp.role}
                                                company={exp.company}
                                                handleEditClick={
                                                    isOwnProfile
                                                        ? () =>
                                                            handleEditExperience(
                                                                exp,
                                                                index
                                                            )
                                                        : undefined
                                                }
                                                authUser={isOwnProfile}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No experience details added yet
                                    </div>
                                )}
                            </CareerSection>
    
                            {/* Education section */}
                            <CareerSection
                                title="Education"
                                authUser={isOwnProfile}
                                onAddClick={
                                    isOwnProfile
                                        ? handleAddEducation
                                        : undefined
                                }
                            >
                                {profileUser?.education &&
                                profileUser.education.length > 0 ? (
                                    profileUser.education.map((edu, index) => (
                                        <div
                                            key={edu._id || index}
                                            className="relative"
                                        >
                                            <EducationCard
                                                institution={edu.school}
                                                degree={edu.degree}
                                                handleEditClick={
                                                    isOwnProfile
                                                        ? () =>
                                                            handleEditEducation(
                                                                edu,
                                                                index
                                                            )
                                                        : undefined
                                                }
                                                authUser={isOwnProfile}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        No education details added yet
                                    </div>
                                )}
                            </CareerSection>
                        </div>
                    )}
    
                    {activeProfileTab === "posts" && (
                        <div className="">
                            {isLoadingPosts ? (
                                <div className="flex justify-center py-8">
                                    <Loader />
                                </div>
                            ) : isPostsError ? (
                                <div className="text-center py-12 text-red-500">
                                    <h3 className="text-xl">
                                        Error loading posts
                                    </h3>
                                </div>
                            ) : allPosts.length > 0 ? (
                                <>
                                    {allPosts.map((post) => (
                                        <div key={post._id}>
                                            <PostCard
                                                post={post}
                                                onPostUpdate={() => setIsUpdated(!isUpdated)}
                                            />
                                        </div>
                                    ))}
                                    {hasNextPostsPage && (
                                        <div className="flex justify-center py-4">
                                            <button
                                                onClick={() =>
                                                    fetchNextPostsPage()
                                                }
                                                disabled={
                                                    isFetchingNextPostsPage
                                                }
                                                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
                                            >
                                                {isFetchingNextPostsPage
                                                    ? "Loading..."
                                                    : "Load More"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl text-profile-secondary">
                                        No posts yet
                                    </h3>
                                </div>
                            )}
                        </div>
                    )}
    
                    {isSocietyProfile && activeProfileTab === "events" && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold">Events</h2>
                                {isOwnProfile && <CreateEvent />}
                            </div>
                            <div>
                                {events.length > 0 ? (
                                    events.map((event) => (
                                        <ProfileEventCard
                                            event={event}
                                            key={event._id}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <h3 className="text-xl text-profile-secondary">
                                            No events found
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Events created by this society will
                                            appear here
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
    
                    {isSocietyProfile &&
                        isOwnProfile &&
                        activeProfileTab === "members" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">
                                        Members
                                    </h2>
                                    {isOwnProfile && (
                                        <AddMemberForm
                                            onSuccess={() => {
                                                // Refresh the members list
                                                queryClient.invalidateQueries({
                                                    queryKey: [
                                                        "societyMembers",
                                                    ],
                                                    exact: false,
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                                <div>
                                    {isLoadingMembers ? (
                                        <div className="flex justify-center py-8">
                                            <Loader />
                                        </div>
                                    ) : isMembersError ? (
                                        <div className="text-center py-12 text-red-500">
                                            <h3 className="text-xl">
                                                Error loading members
                                            </h3>
                                        </div>
                                    ) : allMembers.length > 0 ? (
                                        <>
                                            {allMembers.map((member) => (
                                                <SocietyMemberCard
                                                    member={member}
                                                    key={member._id}
                                                />
                                            ))}
                                            {hasNextMembersPage && (
                                                <div className="flex justify-center py-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => fetchNextMembersPage()}
                                                        disabled={isFetchingNextMembersPage}
                                                        className="px-6 py-2"
                                                    >
                                                        {isFetchingNextMembersPage ? (
                                                            <>
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            "View More Members"
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <h3 className="text-xl text-profile-secondary">
                                                No members found
                                            </h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
    
                    {isSocietyProfile &&
                        isOwnProfile &&
                        activeProfileTab === "requests" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold">
                                        Membership Requests
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];
                                                if (file) {
                                                    handleCSVUpload(file);
                                                }
                                            }}
                                            className="hidden"
                                            id="csv-upload"
                                            disabled={isUploadingCSV}
                                        />
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                            onClick={() => {
                                                if (!isUploadingCSV) {
                                                    document
                                                        .getElementById(
                                                            "csv-upload"
                                                        )
                                                        ?.click();
                                                }
                                            }}
                                            disabled={isUploadingCSV}
                                        >
                                            <FileUp
                                                className={
                                                    isUploadingCSV
                                                        ? "animate-spin"
                                                        : ""
                                                }
                                            />
                                            {isUploadingCSV
                                                ? "Uploading..."
                                                : "Upload CSV"}
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    {isFetchingNextRequestsPage &&
                                    allRequests.length === 0 ? (
                                        <div className="flex justify-center py-8">
                                            <Loader />
                                        </div>
                                    ) : isRequestsError ? (
                                        <div className="text-center py-12 text-red-500">
                                            <h3 className="text-xl">
                                                Error loading requests
                                            </h3>
                                        </div>
                                    ) : allRequests.length > 0 ? (
                                        <>
                                            {allRequests.map((request) => (
                                                <SocietyRequestCard
                                                    key={request._id}
                                                    request={request}
                                                />
                                            ))}
                                            {hasNextRequestsPage && (
                                                <div className="flex justify-center py-4">
                                                    <button
                                                        onClick={() =>
                                                            fetchNextRequestsPage()
                                                        }
                                                        disabled={
                                                            isFetchingNextRequestsPage
                                                        }
                                                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
                                                    >
                                                        {isFetchingNextRequestsPage
                                                            ? "Loading..."
                                                            : "Load More"}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <h3 className="text-xl text-profile-secondary">
                                                No pending requests
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                All membership requests will
                                                appear here
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </div>
    
            {/* Education Dialog */}
            {isOwnProfile && (
                <EducationDialog
                    open={educationDialogOpen}
                    onOpenChange={setEducationDialogOpen}
                    onSuccess={() => setIsUpdated(!isUpdated)}
                    education={selectedEducation}
                    currentEducations={profileUser?.education}
                />
            )}
    
            {/* Experience Dialog */}
            {isOwnProfile && (
                <ExperienceDialog
                    open={experienceDialogOpen}
                    onOpenChange={setExperienceDialogOpen}
                    onSuccess={() => setIsUpdated(!isUpdated)}
                    experience={selectedExperience}
                    currentExperiences={profileUser?.experience}
                />
            )}
    
            <ProfileImageView
                open={isProfileImageViewOpen}
                onOpenChange={setIsProfileImageViewOpen}
                imageUrl={profileUser?.profileImage || ""}
            />
            <BackgroundImageView
                open={isBackgroundImageViewOpen}
                onOpenChange={setIsBackgroundImageViewOpen}
                imageUrl={
                    profileUser?.profileBackgroundImage || "/Profile-BG.png"
                }
            />
        </div>
    );
}
