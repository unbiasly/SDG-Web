'use client';
import { MapPin, Users, BriefcaseBusiness, Bookmark } from "lucide-react";
import { JobListing } from "@/service/api.interface";
import ColoredDivider from "../feed/ColoredDivider";
import Image from "next/image";
import { formatDate } from "@/lib/utilities/formatDate";
import Options from "../custom-ui/Options";
import Link from "next/link";
import { useState } from "react";

interface JobDetailProps {
    job: JobListing;
}


const JobDetail = ({ job }: JobDetailProps) => {

    const [isBookmarkActive, setIsBookmarkActive] = useState(job.isSaved || false);

    const details = [
        {
            icon: <Users size={16} className="text-gray-600" />,
            label: `${job?.applicants || 0} applicants`,
        },
        {
            icon: <MapPin size={16} className="text-gray-600" />,
            label: `${job.location} • ${formatDate(job.postedAt)}`,
        },
        // {
        //     icon: <BriefcaseBusiness size={16} className="text-gray-600" />,
        //     label: job.jobType.charAt(0).toUpperCase() + job.jobType?.slice(1).toLowerCase(),
        // }
        // jobtype, salaryRange, experienceLevel, 
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
        // {
        //     label: "Job type:",
        //     value: job.jobType.charAt(0).toUpperCase() + job.jobType?.slice(1).toLowerCase()
        // },
        {
            label: job.jobType === 'internship' ? "Stipend:" : "Salary:",
            value: job.salaryRange
        }
    ];

    const handleBookmark = () => {
        setIsBookmarkActive(!isBookmarkActive);
    };

    const menuOptions = [
        {
            icon: (
                <Bookmark
                    className={`h-5 w-5 ${
                        isBookmarkActive
                            ? "fill-current text-accent"
                            : "text-gray-500"
                    }`}
                />
            ),
            label: isBookmarkActive ? "Saved" : "Save",
            onClick: handleBookmark,
        },
    ]




    return (
        <div className="px-4 relative">
            <div className="flex justify-between items-start mb-4">
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
                {/* <Options menuOptions={menuOptions}/> */}
            </div>

            <div className="mb-5">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        {detail.icon}
                        <span className="text-sm text-gray-700">{detail.label}</span>
                    </div>
                ))}
            </div>

            {job.skills && (
                <div className="flex flex-wrap gap-2 mb-5">
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

            <div className="grid grid-cols-2 gap-4 mb-5">
                {job.applyUrl ? 
                <Link href={job.applyUrl} target="_blank" className="bg-accent text-center text-white py-2 rounded-full">
                    Apply
                </Link>
                : <></>}
                <button className={`border border-accent cursor-pointer text-accent py-2 rounded-full ${isBookmarkActive ? "bg-accent/80 text-white" : ""}`} onClick={handleBookmark}>
                    Save
                </button>
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
                    <p className="text-sm leading-relaxed">
                        {job.description || "No description provided."}
                    </p>
                </section>

                {/* <section className="gap-2">
                    <h3 className="font-medium mb-2">Key Responsibilities</h3>
                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                        <li>
                            Develop and maintain high-quality mobile and web
                            applications using Flutter and ReactJs.
                        </li>
                        <li>
                            Collaborate with cross-functional teams to define,
                            design, and ship new features.
                        </li>
                        <li>
                            Optimize applications for maximum speed and
                            scalability.
                        </li>
                        <li>
                            Implement clean, modern, and smooth animations and
                            transitions for an enhanced user experience.
                        </li>
                        <li>
                            Ensure the technical feasibility of UI/UX designs.
                        </li>
                        <li>
                            Integrate mobile and web applications with back-end
                            services and databases.
                        </li>
                        <li>Monitor and improve front-end performance.</li>
                        <li>
                            Stay updated on emerging technologies in mobile and
                            web development.
                        </li>
                        <li>Identify and correct bottlenecks and fix bugs.</li>
                        <li>Conduct code reviews, testing, and debugging.</li>
                        <li>
                            Work on continuous improvement of development
                            processes and tools.
                        </li>
                        <li>
                            Provide technical guidance and support to other team
                            members.
                        </li>
                        <li>
                            Assure app quality, stability, and maintainability.
                        </li>
                        <li>
                            Collaborate with designers to translate UI/UX design
                            wireframes into code.
                        </li>
                    </ul>
                </section>

                <section className="gap-2">
                    <h3 className="font-medium mb-2">
                        Required Qualifications
                    </h3>
                    <ul className="list-disc list-outside ml-5 text-sm space-y-1">
                        <li>
                            Bachelor's degree in Computer Science, Engineering,
                            or related field.
                        </li>
                        <li>
                            Proven experience as a Flutter developer, ReactJs
                            developer & AWS
                        </li>
                        <li>Proficient in Dart programming language.</li>
                        <li>Familiarity with Git for version control.</li>
                        <li>
                            Strong understanding of UI/UX design principles.
                        </li>
                        <li>
                            Experience with Firebase for mobile/web development.
                        </li>
                        <li>Knowledge of RESTful APIs and JSON.</li>
                        <li>
                            Experience with automated testing suites and CI/CD
                            pipelines.
                        </li>
                    </ul>
                </section> */}
            </div>
        </div>
    );
};

export default JobDetail;
