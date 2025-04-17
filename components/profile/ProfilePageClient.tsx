"use client"
import React, { useEffect, useState } from 'react'
import { Eye, LinkIcon } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileAnalyticsCard from '@/components/profile/ProfileAnalyticsCard';
import { CareerSection } from '@/components/profile/ExperienceCard';
import { PROFILE_ANALYTICS, PROFILE_TABS } from '@/lib/constants/index-constants';
import { useUser } from '@/lib/redux/features/user/hooks';
import { AnalyticsResponseData, Education, PostsFetchResponse, UserData, Experience } from '@/service/api.interface';
import { PostCard } from '@/components/feed/PostCard';
import { UserProfileDialog } from '@/components/userDataDialogs/ProfileDialog';
import Link from 'next/link';
import { EducationDialog } from '@/components/userDataDialogs/EducationDialog';
import { formatDate } from '@/lib/utilities/formatDate';
import Image from 'next/image';
import { ExperienceDialog } from '@/components/userDataDialogs/ExperienceDialog';
import ExperienceCard from '@/components/profile/ExperienceCard';
import EducationCard from '@/components/profile/EducationCard';
import FollowButton from '@/components/profile/FollowButton';

const ProfilePageClient = ({ userId }: { userId: string }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [posts, setPosts] = useState<PostsFetchResponse>();
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [analytics, setAnalytics] = useState<AnalyticsResponseData | null>(null);
    // Education dialog state
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState<number | undefined>(undefined);
    
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
    const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | undefined>(undefined);
    
    const { user, userLoading } = useUser();
    const isOwnProfile = user?._id === profileUser?._id;
    // Fetch user data by userId
    const fetchUserById = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id }),
            });
            
            if (!response.ok) {
                throw new Error('User not found');
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
            setIsLoading(false);
        }
    };
    
    const getUserPosts = async (userId: string) => {
        try {
            const postsResponse = await fetch(`/api/post/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            const postsData = await postsResponse.json();
            setPosts(postsData);
            return postsData;
        } catch(error) {
            console.error("Post Fetch Error \n", error);
            return null;
        }
    }

    // Track profile view when page loads
    const getAnalytics = async () => {
        try {
            const response = await fetch(`/api/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'get',
                    userId: userId,
                    startDate: "2025-03-15",
                    endDate: "2025-04-15"
                }),
            });
                const analyticsData = await response.json();
                setAnalytics(analyticsData);
                console.log("Analytics Data \n", analytics);
            return analyticsData;
        } catch(error) {
            console.error("Analytics Fetch Error \n", error);
            return null;
        }
    }
    const initializeProfile = async () => {
        if (!userId) return;
        
        const userData = await fetchUserById(userId);
        
        if (userData?._id) {
            getUserPosts(userData._id);
            
            
            if (isOwnProfile) {
                // Only fetch analytics if viewing own profile
                getAnalytics();
            } else if (!isOwnProfile) {
                // Only track profile view if viewing someone else's profile
                trackProfileView(userData._id);
            }
        }
    };
    useEffect(() => {
        
        initializeProfile();
    }, [isOwnProfile]);

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

    // Function to handle saving education data
    const handleSaveEducation = async (education: Education, index?: number, isDeleted?: boolean) => {
        // If item was deleted or edited, we need to refresh user data
        if (isDeleted || index !== undefined) {
            // Refresh user data
            await fetchUserById(userId);
        }
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

    // Function to handle saving experience data
    const handleSaveExperience = async (experience: Experience, index?: number, isDeleted?: boolean) => {
        // If item was deleted or edited, we need to refresh user data
        if (isDeleted || index !== undefined) {
            // Refresh user data
            await fetchUserById(userId);
        }
    };
    // {
    //     "action": "track",
    //     "userId": "507f1f77bcf86cd799439012",
    //     "type": "profile_view"
    //   }
    const trackProfileView = async (userId: string) => {
        try {
          const response =await fetch('/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'track',
              userId: userId,
              type: 'profile_view',
              viewerId: user?._id
            }),
          });
          const data = await response.json();
        } catch (error) {
          console.error("Failed to track post impression:", error);
        }
      };


    // Show loading state while fetching profile data
    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex flex-1 justify-center items-center">
                <div className="animate-pulse text-xl">Loading profile...</div>
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
        <div className="w-full min-h-screen flex flex-1 flex-col border-gray-300 rounded-2xl border-1 pb-20">
          {/* Header with gray background */}
          <div className="h-40 rounded-t-xl relative overflow-hidden">
            {profileUser?.profileBackgroundImage ? (
              <Image 
                src={typeof profileUser.profileBackgroundImage === 'string' ? profileUser.profileBackgroundImage : ''}
                alt="Profile background"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          {/* Main content */}
          <div className="w-full mx-auto px-4 sm:px-6 -mt-20 relative z-10">
            {/* Profile header */}
            <div className="flex justify-between items-end mb-8">
              <ProfileAvatar 
                size="xl"
                src={profileUser?.profileImage || ''}
                alt="Profile" 
                
              />
              {isOwnProfile ? <UserProfileDialog /> : <FollowButton targetId={profileUser?._id} userId={user?._id || ''}/>}
            </div>
            
            {/* Profile info */}
            <div className="mt-6 animate-scale-in">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">
                  {profileUser?.fName && profileUser?.lName 
                    ? `${profileUser.fName} ${profileUser.lName}` 
                    : profileUser?.username}
                </h1>
              </div>
              <p className="text-xl">{profileUser?.occupation || ''}</p>
              <p className="text-xl font-semibold">{profileUser?.headline || ''}</p>
              
              <div className="flex gap-6 my-3">
                  <Link href={`/profile/${profileUser?._id}/connections`} className="flex items-baseline gap-1 cursor-pointer hover:underline">
                    <span className="text-profile-text font-semibold">{analytics?.data?.followCounts?.followerCount}</span>
                    <span>Followers</span>
                  </Link>
                  <Link href={`/profile/${profileUser?._id}/connections`} className="flex items-baseline gap-1 cursor-pointer hover:underline">
                    <span className="text-profile-text font-semibold">{analytics?.data?.followCounts?.followingCount}</span>
                    <span>Following</span>
                  </Link>
              </div>

              <div className="mt-4 text-profile-secondary">
                <p className="mb-1">{profileUser?.experience?.[0]?.company || ''}</p>
                <p className="mb-1">{profileUser?.location || ''}</p>
                <Link href={profileUser?.portfolioLink || ''} className="flex items-center gap-1 mb-4">
                  <LinkIcon size={16} />
                  <span>{profileUser?.portfolioLink || ''}</span>
                </Link>
                
                {profileUser?.bio && (
                  <div className="mb-4">
                    <p className="text-md text-gray-500">{profileUser.bio}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <ProfileTabs 
              tabs={PROFILE_TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="mt-4"
            />
            
            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'about' && (
                <div className="space-y-8 animate-fade-in">
                  {/* Analytics section - only show for own profile */}
                  {isOwnProfile && (
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">Analytics</h2>
                        <div className="flex items-center gap-1 text-sm text-profile-secondary bg-gray-100 px-3 py-1 rounded-full">
                          <Eye size={14} />
                          <span>Private to you</span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {PROFILE_ANALYTICS.map((analyticsItem) => {
                          let count = 0;
                          if (analyticsItem.type === "views") {
                            count = analytics?.data?.analytics?.total_views || 0;
                          } else {
                            count = analytics?.data?.analytics?.total_post_impressions || 0;
                          }
                          
                          return (
                            <ProfileAnalyticsCard 
                              key={analyticsItem.type}
                              type={analyticsItem.type as "views" | "impressions"}
                              count={count}
                              description={analyticsItem.description}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience section */}
                  <CareerSection 
                    title="Experience" 
                    onAddClick={isOwnProfile ? handleAddExperience : undefined} 
                    authUser={isOwnProfile}
                  >
                    {profileUser?.experience && profileUser.experience.length > 0 ? (
                      profileUser.experience.map((exp, index) => (
                        <div key={index} className="relative">
                          <ExperienceCard 
                            position={exp.role}
                            company={exp.company}
                            handleEditClick={isOwnProfile ? () => handleEditExperience(exp, index) : undefined}
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
                    onAddClick={isOwnProfile ? handleAddEducation : undefined}
                  >
                    {profileUser?.education && profileUser.education.length > 0 ? (
                      profileUser.education.map((edu, index) => (
                        <div key={index} className="relative">
                          <EducationCard 
                            institution={edu.school}
                            degree={edu.degree}
                            handleEditClick={isOwnProfile ? () => handleEditEducation(edu, index) : undefined}
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
              
              {activeTab === 'posts' && (
                  <div className="">
                    {(posts?.data && posts.data.length > 0) ? (
                      posts.data.map((post) => (
                        <div key={post._id}>
                          <PostCard
                            isReposted={post.original_post_id !== null}
                            key={post._id}
                            _id={post._id}
                            name={post.user_id.name || ''}
                            handle={`@${post.user_id.username}`}
                            avatar={post.user_id.profileImage || ''}
                            time={formatDate(post.updatedAt)}
                            isLiked={post.isLiked}
                            userId={post.user_id._id}
                            isBookmarked={post.isBookmarked || false}
                            content={post.content}
                            imageUrl={post.images || []}
                            likesCount={post.poststat_id?.likes || 0}
                            commentsCount={post.poststat_id?.comments || 0}
                            repostsCount={post.poststat_id?.reposts || 0}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-xl text-profile-secondary">No posts yet</h3>
                      </div>
                    )}
                  </div>
              )}
            </div>
          </div>

          {/* Education Dialog */}
          {isOwnProfile && (
            <EducationDialog
              open={educationDialogOpen}
              onOpenChange={setEducationDialogOpen}
              onSave={handleSaveEducation}
              education={selectedEducation}
              index={selectedEducationIndex}
            />
          )}

          {/* Experience Dialog */}
          {isOwnProfile && (
            <ExperienceDialog
              open={experienceDialogOpen}
              onOpenChange={setExperienceDialogOpen}
              onSave={handleSaveExperience}
              experience={selectedExperience}
              index={selectedExperienceIndex}
            />
          )}
        </div>
      );
}

export default ProfilePageClient;