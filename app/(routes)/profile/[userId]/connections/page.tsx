"use client";
import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { AnalyticsResponseData } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import ProfileAvatar from "@/components/profile/ProfileAvatar";

type UserType = {
    _id: string;
    name?: string;
    username: string;
    occupation?: string;
    email: string;
    following?: boolean;
    profileImage?: string;
};

interface ConnectionsPageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default function Page({ params }: ConnectionsPageProps) {
    const searchQueryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const tab = searchQueryParams.get("tab");
    const resolvedParams = use(params);
    const userId = resolvedParams.userId;

    
    const [profileUser, setProfileUser] = useState<UserType | null>(null);

    // Check if we're on the client side
    // if (typeof window !== 'undefined') {
    //     const savedTab = localStorage.getItem(`activeFollowTab_${userId}`);
    //     return (savedTab === "followers" || savedTab === "following") ? savedTab : "followers";
    // }

    useEffect(() => {
        // Check if Tab is fetched from URL
        if (tab && (tab === "followers" || tab === "following")) {
            setActiveFollowTab(tab);
        } else {
            // Fallback to localStorage if no valid tab in URL
            const savedTab = localStorage.getItem(`activeFollowTab_${userId}`);
            if (savedTab === "followers" || savedTab === "following") {
                setActiveFollowTab(savedTab);
            } else {
                setActiveFollowTab("followers"); // Default to followers
            }
        }
        
    }, [userId, tab]);

    // Initialize activeFollowTab with localStorage value or default to "followers"
    const [activeFollowTab, setActiveFollowTab] = useState<"followers" | "following">('followers');

    const [analytics, setAnalytics] = useState<AnalyticsResponseData | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(true);


    const fetchUserById = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: id }),
            });

            if (!response.ok) {
                throw new Error("User not found");
            }

            const userData = await response.json();
            if (userData?.data) {
                setProfileUser(userData.data);
                return userData.data;
            }
            return null;
        } catch (error) {
            console.error("Failed to fetch user by ID:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch followers with cursor-based pagination
    const fetchFollowers = async ({ pageParam = null }) => {
        const response = await fetch(`/api/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                action: "followers",
                limit: 10,
                cursor: pageParam || "",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch followers");
        }

        return await response.json();
    };

    // Function to fetch following with cursor-based pagination
    const fetchFollowing = async ({ pageParam = null }) => {
        const response = await fetch(`/api/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                action: "following",
                limit: 10,
                cursor: pageParam || "",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch following");
        }

        return await response.json();
    };


    useEffect(() => {
        getAnalytics();
        fetchUserById(userId);
    }, [userId]);

    // Set up infinite queries for followers and following
    // The key change: enabled is always true to prefetch both
    const {
        data: followersData,
        fetchNextPage: fetchNextFollowers,
        hasNextPage: hasMoreFollowers,
        isFetching: isLoadingFollowers,
        isError: followersError,
    } = useInfiniteQuery({
        queryKey: ["followers", userId],
        queryFn: fetchFollowers,
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasMore
                ? lastPage.pagination.nextCursor
                : undefined,
        initialPageParam: null,
        enabled: true, // Always fetch regardless of active tab
        staleTime: Infinity, // Cache as long as the page is mounted
        gcTime: 0, // Clear cache immediately when component unmounts
    });

    const {
        data: followingData,
        fetchNextPage: fetchNextFollowing,
        hasNextPage: hasMoreFollowing,
        isFetching: isLoadingFollowing,
        isError: followingError,
    } = useInfiniteQuery({
        queryKey: ["following", userId],
        queryFn: fetchFollowing,
        getNextPageParam: (lastPage) =>
            lastPage.pagination?.hasMore
                ? lastPage.pagination.nextCursor
                : undefined,
        initialPageParam: null,
        enabled: true, // Always fetch regardless of active tab
        staleTime: Infinity, // Cache as long as the page is mounted
        gcTime: 0, // Clear cache immediately when component unmounts
    });

    // Mutation for follow/unfollow
    // const followMutation = useMutation({
    //     mutationFn: async ({
    //         targetUserId,
    //         action,
    //     }: {
    //         targetUserId: string;
    //         action: "follow" | "unfollow";
    //     }) => {
    //         const response = await fetch(`/api/follow`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 userId,
    //                 followingId: targetUserId,
    //                 action,
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Failed to ${action} user`);
    //         }

    //         return await response.json();
    //     },
    //     onSuccess: () => {
    //         // Invalidate relevant queries to trigger a refetch
    //         queryClient.invalidateQueries({ queryKey: ["followers", userId] });
    //         queryClient.invalidateQueries({ queryKey: ["following", userId] });
    //     },
    // });
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
                }),
            });
            const analyticsData = await response.json();
            setAnalytics(analyticsData);
            setLoading(false);
            console.log("Analytics Data \n", analytics);
            return analyticsData;
        } catch (error) {
            console.error("Analytics Fetch Error \n", error);
            return null;
        }
    };

    //   const handleFollowToggle = useCallback((user: UserType) => {
    //     const action = user.following ? 'unfollow' : 'follow';
    //     followMutation.mutate({
    //       targetUserId: user._id,
    //       action
    //     });
    //   }, [followMutation]);

    // Flatten pages data for rendering - memoized to prevent recalculations
    const followers =
        followersData?.pages.flatMap(
            (page) =>
                page.data?.map((user: UserType) => ({
                    ...user,
                    following: true, // Followers of this profile are users we follow
                })) || []
        ) || [];

    const following =
        followingData?.pages.flatMap(
            (page) =>
                page.data?.map((user: UserType) => ({
                    ...user,
                    following: true, // These are users we're following
                })) || []
        ) || [];

    // Get total counts
    const followersCount = analytics?.data?.followCounts?.followerCount;
    const followingCount = analytics?.data?.followCounts?.followingCount;

    // Function to load more data based on active tab
    const loadMore = useCallback(() => {
        if (activeFollowTab === "followers" && hasMoreFollowers) {
            fetchNextFollowers();
        } else if (activeFollowTab === "following" && hasMoreFollowing) {
            fetchNextFollowing();
        }
    }, [
        activeFollowTab,
        hasMoreFollowers,
        hasMoreFollowing,
        fetchNextFollowers,
        fetchNextFollowing,
    ]);

    // Determine loading states only for visible content
    const isActiveTabLoading =
        (activeFollowTab === "followers" &&
            isLoadingFollowers &&
            followers.length === 0) ||
        (activeFollowTab === "following" &&
            isLoadingFollowing &&
            following.length === 0);

    const isLoadingMore =
        (activeFollowTab === "followers" &&
            isLoadingFollowers &&
            followers.length > 0) ||
        (activeFollowTab === "following" &&
            isLoadingFollowing &&
            following.length > 0);

    const hasError =
        (activeFollowTab === "followers" && followersError) ||
        (activeFollowTab === "following" && followingError);

    // Handle tab change with localStorage persistence
    const handleTabChange = useCallback((tab: "followers" | "following") => {
        setActiveFollowTab(tab);
        // Save to localStorage with user-specific key
        if (typeof window !== 'undefined') {
            localStorage.setItem(`activeFollowTab_${userId}`, tab);
        }
    }, [userId]);

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            {loading ? (
                <header className="border-b border-gray-200 p-4">
                    <div className="flex items-center">
                        <Link href={`/profile/${userId}`} className="mr-4">
                            <ArrowLeft size={24} className="text-black" />
                        </Link>
                        <div>
                            <div className="h-7 w-40 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-5 w-32 bg-gray-100 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </header>
            ) : (
                <>
                    {/* Header */}
                    <header className="border-b border-gray-200 p-4">
                        <div className="flex items-center">
                            <Link href={`/profile/${userId}`} className="mr-4">
                                <ArrowLeft size={24} className="text-black" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {profileUser?.name}
                                </h1>
                                <p className="text-gray-500">
                                    @{profileUser?.username}
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 cursor-pointer py-4 text-center font-medium text-lg ${
                                activeFollowTab === "followers"
                                    ? "text-accent border-b-2 border-accent"
                                    : "text-gray-500"
                            }`}
                            onClick={() => handleTabChange("followers")}
                        >
                            {followersCount} Followers
                        </button>
                        <div className="border-r border-gray-200"></div>
                        <button
                            className={`flex-1 cursor-pointer py-4 text-center font-medium text-lg ${
                                activeFollowTab === "following"
                                    ? "text-accent border-b-2 border-accent"
                                    : "text-gray-500"
                            }`}
                            onClick={() => handleTabChange("following")}
                        >
                            {followingCount} Following
                        </button>
                    </div>
                </>
            )}

            {/* Filter bar */}
            {/* <div className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <button className="flex items-center font-medium">
                    {sortOption} <ChevronDown size={20} className="ml-1" />
                </button>
                </div>
                <div className="relative">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-40 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search
                    size={18}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
                />
                </div>
            </div> */}

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {hasError && (
                    <div className="p-4 text-red-500 text-center">
                        Error loading data. Please try again.
                    </div>
                )}

                {isActiveTabLoading ? (
                    <div className="p-4 text-center">Loading...</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {(activeFollowTab === "followers"
                            ? followers
                            : following
                        ).length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-lg">
                                    {activeFollowTab === "followers" 
                                        ? "No followers yet" 
                                        : "Not following anyone yet"}
                                </p>
                            </div>
                        ) : (
                            <>
                                {(activeFollowTab === "followers"
                                    ? followers
                                    : following
                                ).map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <Link
                                            href={`/profile/${user._id}`}
                                            className="flex items-center flex-1"
                                        >
                                            <ProfileAvatar
                                                src={user.profileImage}
                                                alt={user.name || user.username}
                                                userName={user.name || user.username}
                                                size="sm"
                                                className="rounded-full mr-3 object-cover"
                                            />
                                            <div>
                                                <h3 className="font-bold hover:underline">
                                                    {user.name || user.email}
                                                </h3>
                                                <p className="text-gray-600 hover:underline">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </Link>
                                        {/* <button
                                            onClick={() => handleFollowToggle(user)}
                                            className={`font-medium py-2 px-6 rounded-full transition-colors ${
                                                user.following 
                                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                : 'bg-blue-700 text-white hover:bg-blue-800'
                                            }`}
                                            disabled={followMutation.isPending}
                                            >
                                            {followMutation.isPending && followMutation.variables?.targetUserId === user._id
                                                ? 'Unfollow...'
                                                : user.following ? 'Following' : 'Follow'}
                                            </button> */}
                                    </div>
                                ))}

                                {/* Load more button */}
                                {((activeFollowTab === "followers" && hasMoreFollowers) ||
                                    (activeFollowTab === "following" &&
                                        hasMoreFollowing)) && (
                                    <div className="p-4">
                                        <button
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                            className="w-full py-3 border border-gray-300 rounded-lg text-blue-600 font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            {isLoadingMore ? "Loading..." : "Load More"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
