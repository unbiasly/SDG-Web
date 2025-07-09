"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import Loader from "../Loader";
import ProfileImageDialog from "../userDataDialogs/ProfileImageDialog";
import BackgroundImageDialog from "../userDataDialogs/BackgroundImageDialog";
import ProfileImageView from "./ProfileImageView";
import BackgroundImageView from "./BackgroundImageView";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AppApi } from "@/service/app.api";
import { CreateEvent } from "../events/EventCreateForm";
import CompleteProfileForm from "./CompleteProfileForm";
import SocietyMemberCard from "../society/SocietyMemberCard";
import SocietyRequestCard from "../society/SocietyRequestCard";
import ProfileEventCard from "../events/ProfileEventCard";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AddMemberForm } from "../society/AddMemberForm";

const ProfilePageClient = ({ userId }: { userId: string }) => {
    // Initialize activeProfileTab from localStorage or default to "about"
    const [activeProfileTab, setActiveProfileTab] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("activeProfileTab") || "about";
        }
        return "about";
    });

    const [events, setEvents] = useState<Event[]>([]);
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [analytics, setAnalytics] = useState<AnalyticsResponseData | null>(
        null
    );
    const [isFollowingActive, setIsFollowingActive] = useState(false);
    const [isProfileImageViewOpen, setIsProfileImageViewOpen] = useState(false);
    const [isBackgroundImageViewOpen, setIsBackgroundImageViewOpen] =
        useState(false);

    // Education dialog state
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<
        Education | undefined
    >(undefined);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState<
        number | undefined
    >(undefined);
    // Experience dialog state
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<
        Experience | undefined
    >(undefined);
    const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
        number | undefined
    >(undefined);
    const [isUploadingCSV, setIsUploadingCSV] = useState(false);

    const queryClient = useQueryClient();

    const { user } = useUser();
    const isOwnProfile = user?._id === profileUser?._id;
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const avatarSize = isSmallScreen ? "lg" : "xl";
    const isSocietyProfile = useMemo(
        () => profileUser?.role_slug === "sdg-society",
        [profileUser]
    );

    // Infinite query for user posts
    const {
        data: postsData,
        fetchNextPage: fetchNextPostsPage,
        hasNextPage: hasNextPostsPage,
        isFetchingNextPage: isFetchingNextPostsPage,
        isLoading: isLoadingPosts,
        isError: isPostsError,
        refetch: refetchPosts,
    } = useInfiniteQuery({
        queryKey: ["userPosts", userId],
        queryFn: async ({ pageParam = "" }) => {
            const response = await AppApi.fetchUserPosts(userId, pageParam);
            return response.data;
        },
        getNextPageParam: (lastPage: any) => {
            // Return the cursor for the next page, or undefined if no more pages
            return lastPage?.nextCursor || undefined;
        },
        initialPageParam: "",
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Infinite query for society members
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
            const response = await AppApi.getSocietyMembers(
                30,
                pageParam as string | null
            );
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch society members");
            }
            return response.data;
        },
        getNextPageParam: (lastPage: any) => {
            // Check if there are more pages using the hasMore flag and return nextCursor
            if (lastPage?.pagination?.hasMore && lastPage?.pagination?.nextCursor) {
                return lastPage.pagination.nextCursor;
            }
            return undefined;
        },
        initialPageParam: null,
        enabled: !!userId && isSocietyProfile && isOwnProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Infinite Query for Society Requests
    const {
        data: requestsData,
        fetchNextPage: fetchNextRequestsPage,
        hasNextPage: hasNextRequestsPage,
        isFetchingNextPage: isFetchingNextRequestsPage,
    } = useInfiniteQuery({
        queryKey: ["societyRequests", userId],
        queryFn: async ({ pageParam = "" }) => {
            const response = await AppApi.getSocietyRequests(
                30,
                pageParam as string
            );
            return response.data;
        },
        getNextPageParam: (lastPage: any) => {
            // Return the cursor for the next page, or undefined if no more pages
            return lastPage?.nextCursor || undefined;
        },
        initialPageParam: "",
        enabled: !!userId && isSocietyProfile && isOwnProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Flatten the paginated data
    const allPosts = useMemo(() => {
        return postsData?.pages.flatMap((page: any) => page?.data || []) || [];
    }, [postsData]);

    const allMembers = useMemo(() => {
        return (
            membersData?.pages.flatMap((page: any) => page?.data || []) || []
        );
    }, [membersData]);

    const allRequests = useMemo(() => {
        return (
            requestsData?.pages.flatMap((page: any) => page?.data || []) || []
        );
    }, [requestsData]);

    // Fetch user data by userId
    const fetchUserById = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await AppApi.fetchUser(id);

            if (!response.success) {
                throw new Error("User not found");
            }

            const userData = await response.data;
            if (userData?.data) {
                setProfileUser(userData.data);
                setIsFollowingActive(userData.data.isFollowing);
                return userData.data;
            }
            return null;
        } catch (error) {
            console.error("Failed to fetch user by ID:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Track profile view when page loads
    const getAnalytics = async () => {
        try {
            const response = await fetch(`/api/analytics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "get",
                    userId: userId,
                    startDate: "2025-03-15",
                    endDate: "2025-04-15",
                }),
            });
            const analyticsData = await response.json();
            setAnalytics(analyticsData);
            console.log("Analytics Data \n", analytics);
            return analyticsData;
        } catch (error) {
            console.error("Analytics Fetch Error \n", error);
            return null;
        }
    };

    const trackProfileView = async (userId: string) => {
        // Don't track if the profile being viewed is the user's own profile
        if (user?._id === userId) return;

        try {
            const response = await fetch("/api/analytics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "track",
                    userId: userId,
                    type: "profile_view",
                    viewerId: user?._id,
                }),
            });
            const data = await response.json();
        } catch (error) {
            console.error("Failed to track profile view:", error);
        }
    };

    const getSocietyEvents = async () => {
        try {
            const response = await AppApi.getEvents("event", undefined, userId);
            const eventsData = await response.data;
            setEvents(eventsData.data);
            return eventsData;
        } catch (error) {
            console.error("Failed to fetch society events:", error);
            return null;
        }
    };

    // Effect for fetching core user data and tracking profile view
    useEffect(() => {
        const fetchData = async () => {
            // Track profile view if not own profile
            if (user?._id && user._id !== userId) {
                trackProfileView(userId);
            }

            // Fetch user data
            const userData = await fetchUserById(userId);

            getSocietyEvents();
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [userId, user?._id]);

    // Save activeProfileTab to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined" && !isSocietyProfile) {
            localStorage.setItem("activeProfileTab", activeProfileTab);
        }
    }, [activeProfileTab, isSocietyProfile]);

    useEffect(() => {
        getAnalytics();
    }, [isFollowingActive]);

    useEffect(() => {
        const handleUserUpdate = (event: CustomEvent) => {
            setProfileUser(event.detail);
        };

        window.addEventListener(
            "user-profile-updated",
            handleUserUpdate as EventListener
        );

        return () => {
            window.removeEventListener(
                "user-profile-updated",
                handleUserUpdate as EventListener
            );
        };
    }, []);

    // Function to refresh posts after update
    const handlePostUpdate = () => {
        refetchPosts();
    };

    // Function to open dialog for adding new education
    const handleAddEducation = () => {
        setSelectedEducation(undefined);
        setEducationDialogOpen(true);
    };

    // Function to open dialog for editing existing education
    const handleEditEducation = (education: Education, index: number) => {
        setSelectedEducation(education);
        setSelectedEducationIndex(index);
        setEducationDialogOpen(true);
    };

    // Function to open dialog for adding new experience
    const handleAddExperience = () => {
        setSelectedExperience(undefined);
        setExperienceDialogOpen(true);
    };

    // Function to open dialog for editing existing experience
    const handleEditExperience = (experience: Experience, index: number) => {
        setSelectedExperience(experience);
        setSelectedExperienceIndex(index);
        setExperienceDialogOpen(true);
    };

    // Handle CSV file upload
    const handleCSVUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith(".csv")) {
            toast.error("Please select a valid CSV file");
            return;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        setIsUploadingCSV(true);

        try {
            // Call the API to upload CSV
            const response = await AppApi.addSocietyMember(
                undefined,
                file
            );

            if (response.success) {
                toast.success(
                    "CSV uploaded successfully! Members have been added."
                );

                // Invalidate and refetch the society members query
                queryClient.invalidateQueries({
                    queryKey: ["societyMembers"],
                    exact: false,
                });

                // Clear the file input
                const fileInput = document.getElementById(
                    "csv-upload"
                ) as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = "";
                }
            } else {
                toast.error(response.error || "Failed to upload CSV file");
            }
        } catch (error) {
            console.error("Error uploading CSV:", error);
            toast.error("An error occurred while uploading the CSV file");
        } finally {
            setIsUploadingCSV(false);
        }
    };

    // Show loading state while fetching profile data
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center border-gray-300 rounded-2xl border-1 pb-20">
                <Loader />
            </div>
        );
    }

    // Show not found message if user doesn't exist
    if (!profileUser) {
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
                    <UserProfileDialog />
                ) : (
                    <FollowButton
                        targetId={profileUser?._id}
                        userId={user?._id || ""}
                        followed={isFollowingActive}
                        onFollowChange={(isFollowing) => {
                            setIsFollowingActive(isFollowing);
                        }}
                    />
                )}
            </div>

            {/* Main content */}
            <div className="w-full  relative z-5">
                {/* Profile info */}
                <div className="mt-6 space-y-1 px-6  animate-scale-in">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl lg:text-3xl font-bold">
                            {profileUser?.fName && profileUser?.lName
                                ? `${profileUser.fName} ${profileUser.lName}`
                                : `@${profileUser?.username}`}
                        </h1>
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
                                {analytics?.data?.followCounts?.followerCount}{" "}
                                Followers
                            </span>
                        </Link>
                        <Link
                            href={`/profile/${profileUser?._id}/connections?tab=following`}
                            className="flex items-baseline gap-1 cursor-pointer"
                        >
                            <span className="text-profile-text font-semibold hover:underline">
                                {analytics?.data?.followCounts?.followingCount}{" "}
                                Following
                            </span>
                        </Link>
                    </div>

                    <div className=" lg:mt-2 text-profile-secondary">
                        <p className="mb-1">
                            {profileUser?.experience?.[0]?.company || ""}
                        </p>
                        <p className="mb-1">{profileUser?.location || ""}</p>
                        {profileUser?.portfolioLink && (
                            <Link
                                href={profileUser?.portfolioLink || ""}
                                target="_blank"
                                className="flex items-center gap-1 mb-4"
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
                    {!profileUser?.roleRequested && (
                        <CompleteProfileForm role={profileUser.role_slug} />
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
                <div className="mt-6 px-4">
                    {activeProfileTab === "about" && (
                        <div className="space-y-8  animate-fade-in">
                            {/* Analytics section - only show for own profile */}
                            {isOwnProfile && (
                                <div className="border-b pb-2">
                                    <div className="flex items-center  gap-2">
                                        <h2 className="text-xl lg:text-2xl font-bold">
                                            Analytics
                                        </h2>
                                        <div className="flex items-center gap-1 text-sm text-profile-secondary bg-gray-100 px-2 py-1 rounded-full">
                                            <Eye size={14} />
                                            <span>Private to you</span>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
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
                                {profileUser?.experience &&
                                profileUser.experience.length > 0 ? (
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
                                                onPostUpdate={handlePostUpdate}
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
                    onSave={() => console.log("Education saved")}
                    education={selectedEducation}
                    currentEducations={profileUser?.education}
                />
            )}

            {/* Experience Dialog */}
            {isOwnProfile && (
                <ExperienceDialog
                    open={experienceDialogOpen}
                    onOpenChange={setExperienceDialogOpen}
                    onSuccess={() => console.log("Experience saved")}
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
};

export default ProfilePageClient;
