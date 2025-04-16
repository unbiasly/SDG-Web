"use client"
import React, { useEffect, useState, Suspense } from 'react'
import { Camera, CircleCheckBig, Eye, LinkIcon, Plus, Pencil, ArrowRight } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileAnalyticsCard from '@/components/profile/ProfileAnalyticsCard';
import EnhancedExperienceCard, { CareerSection } from '@/components/profile/ExperienceCard';
import EnhancedEducationCard from '@/components/profile/EducationCard';
import { PROFILE_ANALYTICS, PROFILE_TABS } from '@/lib/constants/index-constants';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Education, PostsFetchResponse, UserData } from '@/service/api.interface';
import { PostCard } from '@/components/feed/PostCard';
import { UserProfileDialog } from '@/components/userDataDialogs/ProfileDialog';
import Link from 'next/link';
import { EducationDialog } from '@/components/userDataDialogs/EducationDialog';
import { formatDate } from '@/lib/utilities/formatDate';
import Image from 'next/image';
import { Experience } from '@/service/api.interface';
import { ExperienceDialog } from '@/components/userDataDialogs/ExperienceDialog';
import ExperienceCard from '@/components/profile/ExperienceCard';
import EducationCard from '@/components/profile/EducationCard';

// Define the params type
type Params = Promise<{ userId: string }>;

// Create a ProfileContent component to handle async params
const ProfileContent = async ({ params }: { params: Params }) => {
  // Await the params to get the userId
  const { userId } = await params;
  
  return <ProfilePageClient userId={userId} />;
};

// Create the client component that uses the userId
const ProfilePageClient = ({ userId }: { userId: string }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [posts, setPosts] = useState<PostsFetchResponse>();
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Education dialog state
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
    const [selectedEducationIndex, setSelectedEducationIndex] = useState<number | undefined>(undefined);
    
    const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>(undefined);
    const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<number | undefined>(undefined);
    
    const { user, userLoading } = useUser();
    
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
    const trackProfileView = async (userId: string) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'track',
                    userId,
                    type: 'profile_view',
                    viewerId: user?._id // Add the current user's ID as the viewer
                }),
            });
        } catch (error) {
            console.error("Failed to track profile view:", error);
        }
    };

    useEffect(() => {
        const initializeProfile = async () => {
            if (!userId) return;
            
            const userData = await fetchUserById(userId);
            
            if (userData?._id) {
                getUserPosts(userData._id);
                trackProfileView(userData._id);
            }
        };
        
        initializeProfile();
    }, [userId, user?._id]);

    // Function to track post impressions when viewing posts
    const trackPostImpression = async (postId: string) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'track',
                    postId,
                    type: 'post_impression',
                    viewerId: user?._id // Add the current user's ID as the viewer
                }),
            });
        } catch (error) {
            console.error("Failed to track post impression:", error);
        }
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
            <div className="w-full min-h-screen flex justify-center items-center">
                <div className="text-xl">User not found</div>
            </div>
        );
    }

    // Check if viewing own profile
    const isOwnProfile = user?._id === profileUser._id;

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
              {isOwnProfile && <UserProfileDialog />}
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
                        {PROFILE_ANALYTICS.map((analytics) => (
                          <ProfileAnalyticsCard 
                            key={analytics.type}
                            type={analytics.type as "views" | "impressions"}
                            count={analytics.count}
                            description={analytics.description}
                          />
                        ))}
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
                        <div key={post._id} onLoad={() => trackPostImpression(post._id)}>
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

// Main page component that wraps the ProfileContent in a Suspense boundary
export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex justify-center items-center">
      <div className="animate-pulse text-xl">Loading...</div>
    </div>}>
      <ProfileContent params={params} />
    </Suspense>
  );
}