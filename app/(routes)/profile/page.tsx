"use client"
import { Camera, CircleCheckBig, Eye, LinkIcon, Plus, Pencil } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileAnalyticsCard from '@/components/profile/ProfileAnalyticsCard';
import ExperienceCard, { ExperienceSection } from '@/components/profile/ExperienceCard';
import EducationCard from '@/components/profile/EducationCard';
import React, { useEffect, useState } from 'react'
import { PROFILE_ANALYTICS, PROFILE_TABS } from '@/lib/constants/index-constants';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/redux/features/user/hooks';
import { Education, PostsFetchResponse } from '@/service/api.interface';
import { PostCard } from '@/components/feed/PostCard';
import { UserProfileDialog } from '@/components/userDataDialogs/ProfileDialog';
import Link from 'next/link';
import { EducationDialog } from '@/components/userDataDialogs/EducationDialog';
import { formatDate } from '@/lib/utilities/formatDate';
import Image from 'next/image';

const Page = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState<PostsFetchResponse>();
    
    // Education dialog state
    const [educationDialogOpen, setEducationDialogOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<Education | undefined>(undefined);
    
    const getUserPosts = async () => {
        try {
            if (!user?._id) return; // Guard clause to prevent unnecessary API calls
            const postsResponse = await fetch(`/api/post/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
            const postsData = await postsResponse.json();
            setPosts(postsData);
            return postsData;
        } catch(error) {
            console.error("Post Fetch Error \n", error);
            return null;
        }
    }
    
        const { 
            user,
            userLoading
        } = useUser();  

    useEffect(() => {
        if (user?._id && !userLoading) {
            getUserPosts();
        }
    }, [user, userLoading]); // Add user and userLoading as dependencies

    // Function to open dialog for adding new education
    const handleAddEducation = () => {
        setSelectedEducation(undefined);
        setEducationDialogOpen(true);
    };

    // Function to open dialog for editing existing education
    const handleEditEducation = (education: Education) => {
        setSelectedEducation(education);
        setEducationDialogOpen(true);
    };

    // Function to handle saving education data
    const handleSaveEducation = (education: Education) => {
        // This will be called after the API call in the EducationDialog component
        console.log('Education saved:', education);
        // You might want to refresh user data here or update local state
    };

    return (
        <div className="w-full   min-h-screen flex flex-1 flex-col border-gray-300 rounded-2xl border-1 pb-20">
          {/* Header with gray background */}
          <div className="h-40 rounded-t-xl relative overflow-hidden">
            {user?.profileBackgroundImage ? (
              <Image 
                src={typeof user.profileBackgroundImage === 'string' ? user.profileBackgroundImage : ''}
                alt="Profile background"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
            {/* <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-105">
              <Camera size={24} className="text-gray-700" />
            </div> */}
          </div>
            {/* Main content */}
          <div className="w-full mx-auto px-4 sm:px-6 -mt-20 relative z-10">
            {/* Profile header */}
            <div className="flex justify-between items-end mb-8">
              <ProfileAvatar 
                size="xl"
                src={user?.profileImage || ''}
                alt="Profile" 
              />
              <UserProfileDialog/>
            </div>
            
            {/* Profile info */}
            <div className="mt-6 animate-scale-in">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{ user?.fName && user?.lName ? `${user.fName} ${user.lName}` : user?.username}</h1>
                {/* <CircleCheckBig size={20} className="text-gray-500" /> */}
              </div>
              <p className="text-xl  ">{user?.occupation || ''}</p>
              <p className="text-xl font-semibold  ">{user?.headline || ''}</p>
              
              
              <div className="mt-4 text-profile-secondary">
                <p className="mb-1">{user?.experience?.[0]?.company || ''}</p>
                <p className="mb-1">{user?.location || ''}</p>
                <Link href={user?.portfolioLink || ''} className="flex items-center gap-1 mb-4">
                  <LinkIcon size={16} />
                  <span>{user?.portfolioLink || ''}</span>
                </Link>
                
                {user?.bio && (
                  <div className="mb-4">
                    <p className="text-md text-gray-500">{user.bio}</p>
                  </div>
                )}
                
                {/* <div className="flex gap-6 mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-profile-text font-semibold">000</span>
                    <span>Followers</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-profile-text font-semibold">000</span>
                    <span>Following</span>
                  </div>
                </div> */}
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
                  {/* Analytics section */}
                  <div className="section-card">
                    <div className="flex items-center gap-2 mb-4">
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
                  
                  {/* Experience section */}
                  <ExperienceSection title="Experience" >
                    <ExperienceCard 
                      logo="/feed/undp-logo-blue.svg"
                      position="Position"
                      company="Company"
                      type="Full Time"
                    />
                  </ExperienceSection>
                  
                  {/* Education section */}
                  <ExperienceSection 
                    title="Education"
                    onAddClick={handleAddEducation}
                    onEditClick={() => {}}
                  >
                    {user?.education && user.education.length > 0 ? (
                      user.education.map((edu) => (
                        <div key={edu._id} className="relative">
                          <EducationCard 
                            logo="/feed/undp-logo-blue.svg"
                            institution={edu.school}
                            degree={edu.degree}
                          />
                          <Button
                            onClick={() => handleEditEducation(edu)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                          >
                            <Pencil size={16} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No education details added yet
                      </div>
                    )}
                  </ExperienceSection>
                </div>
              )}
              
              {activeTab === 'posts' && (
                  <div className="">
                    {(posts?.data && posts.data.length > 0) ? (
                      posts.data.map((post) => (
                        <PostCard
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
          <EducationDialog
            open={educationDialogOpen}
            onOpenChange={setEducationDialogOpen}
            onSave={handleSaveEducation}
            education={selectedEducation}
          />
        </div>
      );
}

export default Page