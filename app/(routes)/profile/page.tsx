"use client"
import { Camera, CircleCheckBig, Eye, LinkIcon } from 'lucide-react';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileAnalyticsCard from '@/components/profile/ProfileAnalyticsCard';
import ExperienceCard, { ExperienceSection } from '@/components/profile/ExperienceCard';
import EducationCard from '@/components/profile/EducationCard';
import React, { useState } from 'react'
import { PROFILE_ANALYTICS, PROFILE_TABS } from '@/lib/constants/index-constants';
import { Button } from '@/components/ui/button';

const Page = () => {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div className="w-full min-h-screen bg-profile-bg animate-fade-in pb-20">
          {/* Header with gray background */}
          <div className="h-40 bg-gray-300 relative">
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm cursor-pointer transition-transform duration-200 hover:scale-105">
              <Camera size={24} className="text-gray-700" />
            </div>
          </div>
          
          {/* Main content */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 animate-slide-up">
            {/* Profile header */}
            <div className="flex justify-between items-end mb-8">
              <ProfileAvatar 
                size="xl"
                src="https://i.pravatar.cc/150?img=65"
                alt="Profile" 
              />
              <Button
                variant="outline"
                className="rounded-full cursor-pointer px-6 py-2 bg-gray-400/70 hover:bg-gray-300/90 text-gray-700 border-none backdrop-blur-sm transition-all duration-300 font-medium"
                // onClick={() => {}}
                >
                    Edit profile
                </Button>
            </div>
            
            {/* Profile info */}
            <div className="mt-6 animate-scale-in">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Full Name</h1>
                <CircleCheckBig size={20} className="text-gray-500" />
              </div>
              <p className="text-xl text-profile-text mt-1">Occupation</p>
              
              <div className="mt-4 text-profile-secondary">
                <p className="mb-1">Company/Institute</p>
                <p className="mb-1">Location</p>
                <p className="flex items-center gap-1 mb-4">
                  <LinkIcon size={16} />
                  <span>Portfolio link/Website</span>
                </p>
                
                <div className="flex gap-6 mt-4 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-profile-text font-semibold">000</span>
                    <span>Followers</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-profile-text font-semibold">000</span>
                    <span>Following</span>
                  </div>
                </div>
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
                  <ExperienceSection title="Experience">
                    <ExperienceCard 
                      logo="/lovable-uploads/058dbcb9-7953-4b10-83b2-894dd8c8b407.png"
                      position="Position"
                      company="Company"
                      type="Full Time"
                    />
                  </ExperienceSection>
                  
                  {/* Education section */}
                  <ExperienceSection title="Education">
                    <EducationCard 
                      logo="/lovable-uploads/058dbcb9-7953-4b10-83b2-894dd8c8b407.png"
                      institution="Institute Name"
                      degree="Degree Name, Specialization"
                    />
                  </ExperienceSection>
                </div>
              )}
              
              {activeTab === 'posts' && (
                <div className="pt-8 animate-fade-in">
                  <div className="text-center py-12">
                    <h3 className="text-xl text-profile-secondary">No posts yet</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}

export default Page