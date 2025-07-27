'use client';
import { MapPin, Users, BriefcaseBusiness, Share2 } from "lucide-react";
import { JobListing } from "@/service/api.interface";
import ColoredDivider from "../feed/ColoredDivider";
import Image from "next/image";
import { formatDate } from "@/lib/utilities/formatDate";
import Options from "../custom-ui/Options";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import ShareContent from "../post/ShareContent";
import { ApplyJob } from "./ApplyJob";
import { AppApi } from "@/service/app.api";
import { useQueryClient } from "@tanstack/react-query";

interface JobDetailProps {
    job: JobListing;
    onSave?: () => void;
}


const JobDetail =  ({ job, onSave }: JobDetailProps) => {

    const [isSaved, setIsSaved] = useState(job.isSaved || false);
    const [shareContentOpen, setShareContentOpen] = useState(false);
    const queryClient = useQueryClient();

    const details = [
        {
            icon: <Users size={16} className="text-gray-600" />,
            label: `${job?.applicants || 0} applicants`,
        },
        {
            icon: <MapPin size={16} className="text-gray-600" />,
            label: `${job.location} • ${formatDate(job?.postedAt || new Date().toISOString())}`,
        },
        {
            icon: <BriefcaseBusiness size={16} className="text-gray-600" />,
            label: job.jobType.charAt(0).toUpperCase() + job.jobType?.slice(1).toLowerCase(),
        }
    ];

    const aboutJob = [
        {
            label: "Job title:",
            value: job.title
        },
        {
            label: "Location:",
            value: job.location
        },
        {
            label: "Job type:",
            value: job.jobType.charAt(0).toUpperCase() + job.jobType?.slice(1).toLowerCase()
        },
        {
            label: job.jobType === 'internship' ? "Stipend:" : "Salary:",
            value: `₹${job.salaryRange}`
        }
    ];

    const handleSave = async () => {
        try {
            const action = isSaved ? 'unsave' : 'saved';
            const answers = isSaved ? [] : [];
            await AppApi.jobAction(job._id || '', action, answers);
            if (onSave) {
                onSave();
            }
            queryClient.invalidateQueries({ queryKey: ['jobs'], exact: false });
        } catch (error) {
            console.error(`Failed to ${isSaved ? 'unsave' : 'save'} job:`, error);
            // Optionally show user feedback about the error
        }
    };

    const menuOptions = [
        {
            icon: <Share2 className={`h-5 w-5 text-gray-500`} />,
            label: "Share",
            onClick: () => setShareContentOpen(true),
        },
    ]

    return (
        <div className="px-4 flex flex-col space-y-3 relative">
            <div className="flex justify-between items-start ">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Image
                            src={job.companyLogo || "/Logo.svg"}
                            alt="SDG Logo"
                            width={40}
                            height={40}
                        />
                        <p className="text-base">{job.companyName}</p>
                    </div>
                    <h3 className="text-xl font-bold text-accent">
                        {job.title}
                    </h3>
                </div>
                <Options menuOptions={menuOptions}/>
            </div>

            <div className="space-y-2">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {detail.icon}
                        <span className="text-sm text-gray-700">{detail.label}</span>
                    </div>
                ))}
            </div>

            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 ">
                    {job.skills.map((match, index) => (
                        <div
                            key={index}
                            className="bg-accent/80 rounded-full py-1.5 px-3 flex items-center gap-1 text-sm"
                        >
                            <span className="text-white">{match}</span>
                            {/* <Check
                                size={18}
                                color="white"
                            /> */}
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4 ">
                {job.applyUrl ? 
                <Link href={job.applyUrl} target="_blank" className="bg-accent text-center text-white py-2 rounded-full">
                    Apply from Link
                </Link>
                : <ApplyJob jobData={job} onSave={onSave} />}
                <Button className={`border h-full hover:border-accent/60 bg-white hover:bg-accent/60 hover:text-white border-accent cursor-pointer text-accent py-2 rounded-full ${isSaved && "bg-accent/80 text-white"}`} onClick={handleSave}>
                    {isSaved ? "Saved" : "Save"}
                </Button>
            </div>

            <ColoredDivider />

            <h2 className="font-semibold my-4">About the job</h2>
            <div className=" flex flex-col gap-6">
                <section className="gap-2">
                    <ul className=" list-outside  text-sm space-y-2">
                        {aboutJob.map((item, index) => (
                            <li key={index} className="text-base">
                                <span className="font-bold">{item.label}</span> {item.value}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="gap-2">
                    {/* <h3 className="font-medium mb-2">Overview</h3> */}
                    <div className="text-sm leading-relaxed space-y-4">
                        {job.description.split('\n\n').map((section, index) => {
                            const lines = section.split('\n');
                            const heading = lines[0];
                            const content = lines.slice(1);
                            
                            // Check if this is a heading (no specific formatting rules, just check if it's short and followed by content)
                            const isHeading = heading && content.length > 0 && heading.length < 50 && !heading.includes('.');
                            
                            return (
                                <div key={index}>
                                    {isHeading ? (
                                        <>
                                            <h3 className="font-medium mb-2">{heading}</h3>
                                            <div className="space-y-2">
                                                {content.map((line, lineIndex) => {
                                                    if (line.trim() === '') return null;
                                                    
                                                    // Check if line starts with a bullet point or seems like a list item
                                                    const isBulletPoint = line.match(/^[•\-\*]/) || 
                                                        (content.length > 1 && line.trim().length > 0 && !line.includes(':') && lineIndex > 0);
                                                    
                                                    return isBulletPoint ? (
                                                        <ul key={lineIndex} className="list-disc list-outside ml-5">
                                                            <li>{line.replace(/^[•\-\*]\s*/, '').trim()}</li>
                                                        </ul>
                                                    ) : (
                                                        <p key={lineIndex}>{line}</p>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : (
                                        <p>{section}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
            <ShareContent
                open={shareContentOpen}
                onOpenChange={setShareContentOpen}
                contentUrl={`/${job.jobType === 'internship' ? 'internship' : 'jobs'}/${job._id}`}
                itemId={job._id}
            />
        </div>
    );
};

export default JobDetail;
