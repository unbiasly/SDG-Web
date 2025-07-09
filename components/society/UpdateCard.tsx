import React from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Event } from "@/service/api.interface";
import { format } from "date-fns";

interface UpdateCardProps {
    event: Event;
    // onRemindClick?: () => void;
}

const UpdateCard: React.FC<UpdateCardProps> = ({
    event
    // onRemindClick,
}) => {
    return (
        <div className="bg-white border-1 border-black rounded-lg shadow-md overflow-hidden lg:mx-10">
            <div className="relative rounded-t-lg">
                {event.banners && event.banners.length > 0 ? (
                <Image
                    src={event.banners[0]}
                    alt={event.title}
                    width={500}
                    height={300}
                    className="w-full object-cover rounded-t-lg aspect-video"
                />
                ) : (
                    <div className="w-full h-[300px] bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                        </h3>
                        <p className="text-gray-600 text-xs lg:text-sm mb-1">
                            {event.time ? format(new Date(event.time), "eee, dd MMM yyyy h:mm a") : 'Date not available'}
                        </p>
                        <p className="text-gray-600 text-xs lg:text-sm">{event.location}</p>
                    </div>
                    {/* <button
                        onClick={onRemindClick}
                        className="bg-accent hover:bg-accent/80 cursor-pointer text-white px-2 lg:px-4 py-2 rounded-md flex items-center gap-2 text-xs lg:text-sm font-medium transition-colors duration-200"
                    >
                        <Bell className="w-5 h-5" color="white" />
                        Remind me
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default UpdateCard;
