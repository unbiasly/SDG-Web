import { Event } from "@/service/api.interface";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

interface ProfileEventCardProps {
    event: Event;
}

const ProfileEventCard = ({ event }: ProfileEventCardProps) => {
    // Format the event date
    const eventDate = new Date(event.time);
    const isValidDate = !isNaN(eventDate.getTime());
    const isUpcoming = isValidDate && eventDate > new Date();

    return (
        <div
            className="border flex p-2 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow mb-4 cursor-pointer"
        >
            {event.banners && event.banners.length > 0 && (
                <div className="relative aspect-square w-40 flex-shrink-0">
                    <Image
                        src={event.banners[0]}
                        alt={`${event.title} event banner`}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            )}
            <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    {/* Date and time */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{format(eventDate, "eee, dd MMM yyyy")}</span>
                        <span>•</span>
                        <span>{format(eventDate, "h:mm a")}</span>
                    </div>

                    {/* Event status */}
                    {/* <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isUpcoming
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {isUpcoming ? "Upcoming" : "Past"}
                    </div> */}
                </div>

                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {event.title}
                </h3>

                {event.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {event.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    {event.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{event.location}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <UsersIcon className="w-4 h-4" />
                            <span>{event.host?.length || 1}</span>
                            <span>
                                Host{(event.host?.length || 1) > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEventCard;
