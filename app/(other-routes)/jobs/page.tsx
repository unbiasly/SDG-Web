'use client'
import JobCard from '@/components/jobs/JobCard';
import JobDetail from '@/components/jobs/JobDetail';
import JobSearch from '@/components/jobs/JobSearch';
import { cn } from '@/lib/utils';
import { JobListing } from '@/service/api.interface';
import React, { useState } from 'react'

const Page = () => {
    const [jobs] = useState<JobListing[]>([
        {
          id: 1,
          title: "Flutter & ReactJs Developer",
          company: "UnbaislyAI",
          location: "Delhi, India (On-site)",
          postedDays: 2,
          applicants: 98,
          matches: ["Preference match", "Preference match", "Preference match"]
        },
        {
          id: 2,
          title: "Flutter & ReactJs Developer",
          company: "UnbaislyAI",
          location: "Delhi, India (On-site)",
          postedDays: 2
        },
        {
          id: 3,
          title: "Flutter & ReactJs Developer",
          company: "UnbaislyAI",
          location: "Delhi, India (On-site)",
          postedDays: 2
        },
        {
          id: 4,
          title: "Flutter & ReactJs Developer",
          company: "UnbaislyAI",
          location: "Delhi, India (On-site)",
          postedDays: 2
        }
      ]);
      const tabs = [
        { id: "preferences", label: "Preferences" },
        { id: "applied", label: "Applied Jobs" },
        { id: "saved", label: "Saved Jobs" }
      ];
      
      const [selectedJob, setSelectedJob] = useState<JobListing | null>(jobs[0]);
      const [activeTab, setActiveTab] = useState("preferences");
    
      return (
        <div className="flex min-h-screen bg-white">
          {/* Job Listings Panel */}
          <div className="w-full md:w-[383px] border-r border-gray-200 overflow-auto">
            <div className="p-5">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Jobs</h1>
            </div>
            <div className="flex space-x-2 mb-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "px-4 py-2 rounded-full cursor-pointer text-sm whitespace-nowrap",
                            activeTab === tab.id
                            ? "bg-accent text-white"
                            : "bg-white text-gray-700 border border-gray-300"
                        )}
                    >
                    {tab.label}
                    </button>
                ))}
            </div>
              <JobSearch />
              <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                    />
                ))}
                </div>
              </div>
          </div>
          
          {/* Job Detail Panel */}
          <div className="hidden md:block flex-1 overflow-auto">
            {selectedJob && <JobDetail job={selectedJob} />}
          </div>
        </div>
      );
    };

export default Page