
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
      className={`relative border border-gray-200 rounded-md p-3 cursor-pointer hover:border-gray-400 ${
        isSelected ? "border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="absolute top-3 right-3">
        <button aria-label="." className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
      
      <div className="flex items-start gap-3">
        <Image src='/Logo.svg' alt='SDG Logo' width={40} height={40}  />
        
        <div className="flex-1">
          <h3 className="font-medium text-blue-600">{job.title}</h3>
          <p className="text-sm">{job.company}</p>
          <p className="text-sm text-gray-500">{job.location}</p>
          <p className="text-sm text-gray-500 mt-2">Posted {job.postedDays} days ago</p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;