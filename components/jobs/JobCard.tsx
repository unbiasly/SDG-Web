import { formatDate } from "@/lib/utilities/formatDate";
import { JobListing } from "@/service/api.interface";
import { X } from "lucide-react";
import Image from "next/image";

interface JobCardProps {
    job: JobListing;
    isSelected: boolean;
    onClick: () => void;
}

const JobCard = ({ job, isSelected, onClick }: JobCardProps) => {
    return (
        <div
            className={`relative p-3 cursor-pointer hover:bg-gray-200 ${isSelected ? "bg-accent/15 border-r-3 border-accent" : "border-b pr-4 border-gray-300"}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {job.companyLogo ? <Image src={job.companyLogo} alt="Company Logo" width={50} height={50} /> : <Image src='/Logo.svg' alt="SDG Logo" width={50} height={50} />}
                <div className="flex-1">
                    <h3 className="font-bold  text-accent">{job.title}</h3>
                    <p className="text-sm">{job.companyName}</p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Posted {formatDate(job.postedAt || new Date().toISOString())}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
