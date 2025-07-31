"use client";
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import { ContentFeed } from "@/components/feed/ContentFeed";
import AddReview from "@/components/mentorship/AddReview";
import CreateSlot from "@/components/mentorship/CreateSlot";
import { TestimonialCard } from "@/components/mentorship/TestimonialCard";
import { TimeSlot } from "@/components/mentorship/TimeSlot";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { MENTOR_PROFILE_TABS } from "@/lib/constants/index-constants";
import { useUser } from "@/lib/redux/features/user/hooks";
import { CategoryMentor, MentorReview, MentorSlot } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import { se } from "date-fns/locale";
import { MessageSquare, Plus } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [mentor, setMentor] = useState<CategoryMentor | null>(null);
    const [reviews, setReviews] = useState<MentorReview[]>([]);
    const [slots, setSlots] = useState<MentorSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<MentorSlot | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [activeMentorTab, setActiveMentorTab] = useState("Book a slot");
    const [isLoadingMentor, setIsLoadingMentor] = useState(true);
    const [updatedSlot, setUpdatedSlot] = useState(false);
    const [addedReview, setAddedReview] = useState(false);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const { user } = useUser();
    const selfUserId = user?._id || "";
    

    const fetchReviews = async () => {
        try {
            setIsLoadingReviews(true);
            const response = await AppApi.getMentorReviews(id);
            if (response.success) {
                setReviews(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching mentor reviews:", error);
        } finally {
            setIsLoadingReviews(false);
        }
    };

    const fetchSlots = async () => {
        try {
            const response = await AppApi.getMentorSlots(id);
            if (response.success) {
                setSlots(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching mentor slots:", error);
        }
    };


    const getMentors = async () => {
        try {
            setIsLoadingMentor(true);
            const response = await AppApi.getMentors(undefined, id || "");
            if (response.success) {
                setMentor(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching mentors:", error);
        } finally {
            setIsLoadingMentor(false);
        }
    };

    const bookSlot = async () => {
        try {
            const response = await AppApi.bookSlot(mentor?.category[0] || '', selectedSlot?._id || '');
            if (response.success) {
                console.log("Slot booked successfully:", response.data);
                toast.success("Slot booked successfully!");
                setSelectedSlot(null); // Clear selected slot after booking
                setUpdatedSlot(!updatedSlot);
                // Optionally, you can update the UI or state here
            } else {
                console.error("Failed to book slot:", response.error);
            }
        } catch (error) {
            console.error("Error booking slot:", error);
        }
    }


    const amMentor = mentor?.user._id === selfUserId;

    useEffect(() => {
        getMentors();
    }, [id]);

    useEffect(() => {
        fetchReviews();
    }, [id, addedReview]);

    useEffect(() => {
        fetchSlots();
    }, [id, updatedSlot]);

    // Filter slots based on selected date (considering IST)
    const filteredSlots = selectedDate 
        ? slots.filter(slot => {
            const slotDate = new Date(slot.startTime);
            const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
            const istSlotDate = new Date(slotDate.getTime() + istOffset);
            const slotDateStr = istSlotDate.toISOString().split('T')[0];
            return slotDateStr === selectedDate;
        })
        : slots;

    return (
        <div className="min-h-screen flex-1 bg-background">
            <BackPageHeader headerTitle="Mentor Profile" />
            <div className="mx-auto p-4 ">
                {/* Profile Header */}
                <div className="flex lg:justify-between p-2 lg:p-5 items-center gap-5">
                    <div className="flex flex-col space-y-2">
                        {isLoadingMentor ? (
                            <>
                                <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="h-6 w-64 bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                                    {mentor?.user.name}
                                </h3>
                                <p className="text-base sm:text-lg lg:text-lg text-muted-foreground">
                                    {mentor?.title}
                                </p>
                                <p className="text-base sm:text-lg lg:text-lg text-muted-foreground">
                                    {mentor?.experience} year
                                    {mentor?.experience !== "1" ? "s" : ""} of
                                    expertise
                                </p>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                                    <span className="text-base sm:text-lg font-medium">
                                        {mentor?.reviewsCount} Reviews
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {isLoadingMentor ? (
                        <div className="w-[200px] h-[200px] bg-gray-200 rounded-3xl animate-pulse"></div>
                    ) : (
                        <ProfileAvatar
                            src={mentor?.user.profileImage || ""}
                            alt={mentor?.user.name || "Mentor Profile Image"}
                            userName={
                                mentor?.user.name || mentor?.user.username
                            }
                            size="xl"
                            roundedBorder="rounded-xl"
                        />
                    )}
                </div>

                <ContentFeed
                    tabs={MENTOR_PROFILE_TABS}
                    activeTab={activeMentorTab}
                    setActiveTab={setActiveMentorTab}
                >
                    {activeMentorTab === "Book a slot" && (
                        <div className="space-y-4">
                            {isLoadingMentor ? (
                                <div className="h-6 w-96 bg-gray-200 rounded-md animate-pulse"></div>
                            ) : slots.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-end p-2 ">
                                        {amMentor && <CreateSlot mentorId={mentor?._id || ""} onSuccess={() => setUpdatedSlot(!updatedSlot)} /> }
                                    </div>
                                    
                                    <DateTabOrganizer 
                                        slots={slots} 
                                        selectedDate={selectedDate}
                                        onDateSelect={setSelectedDate}
                                    />
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 gap-3">
                                        {filteredSlots.map((slot) => (
                                            <TimeSlot
                                                key={slot._id}
                                                time={slot.startTime}
                                                selected={
                                                    selectedSlot?._id ===
                                                    slot._id
                                                }
                                                onClick={() => {
                                                    if (selectedSlot?._id === slot._id) {
                                                        setSelectedSlot(null);
                                                    } else {
                                                        setSelectedSlot(slot);
                                                    }
                                                }}
                                                available={slot.isBooked === false}
                                            />
                                        ))}
                                    </div>
                                    <div className="w-full flex justify-center p-4">
                                        {selectedSlot && <Button className="bg-accent rounded-full" onClick={bookSlot}>Confirm Consultation</Button>}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 p-4">
                                    <p className="text-lg text-muted-foreground">
                                        Book a consultation slot with{" "}
                                        {mentor?.user.name}.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeMentorTab === "Student's Testimonials" && (
                        <div className="space-y-2 w-full">
                            <AddReview
                                mentorId={mentor?._id || ""}
                                onSuccess={() => setAddedReview(!addedReview)}
                            />
                            {isLoadingReviews ? (
                                // Skeleton for testimonials
                                <div className="space-y-4">
                                    {[1, 2, 3].map((index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 space-y-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <TestimonialCard
                                        key={review._id}
                                        review={review}
                                    />
                                ))
                            ) : (
                                <p className="text-muted-foreground px-4">
                                    No testimonials available for this mentor.
                                </p>
                            )}
                        </div>
                    )}
                </ContentFeed>
            </div>
        </div>
    );
};

// Date Tab Organizer Component
interface DateTabOrganizerProps {
    slots: MentorSlot[];
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

const DateTabOrganizer: React.FC<DateTabOrganizerProps> = ({ slots, selectedDate, onDateSelect }) => {
    // Extract unique dates from slots and sort them
    const uniqueDates = Array.from(
        new Set(
            slots.map(slot => {
                // Convert to IST before extracting date
                const date = new Date(slot.startTime);
                const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
                const istDate = new Date(date.getTime() + istOffset);
                return istDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format in IST
            })
        )
    ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Get today's date in IST for comparison
    const todayIST = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const todayISTDate = new Date(todayIST.getTime() + istOffset);
    todayISTDate.setUTCHours(0, 0, 0, 0); // Reset time to start of day in UTC (which represents IST date)

    // Filter dates that are today or in the future in IST, then take max 4
    const futureDates = uniqueDates.filter(dateStr => {
        const date = new Date(dateStr + 'T00:00:00Z'); // Treat as UTC to avoid timezone conversion
        return date >= todayISTDate;
    }).slice(0, 4);

    // Set default selected date if none selected
    React.useEffect(() => {
        if (!selectedDate && futureDates.length > 0) {
            onDateSelect(futureDates[0]);
        }
    }, [futureDates, selectedDate, onDateSelect]);

    // Helper function to format date for display (IST context)
    const formatDateForDisplay = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00Z');
        const todayISTDateOnly = new Date(todayISTDate);
        const tomorrowIST = new Date(todayISTDate);
        tomorrowIST.setUTCDate(tomorrowIST.getUTCDate() + 1);

        if (date.getTime() === todayISTDateOnly.getTime()) {
            return "Today";
        } else if (date.getTime() === tomorrowIST.getTime()) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'short',
                timeZone: 'UTC' // Since we're treating the date as UTC
            });
        }
    };

    // Count slots for each date (considering IST)
    const getSlotCount = (dateStr: string) => {
        return slots.filter(slot => {
            const slotDate = new Date(slot.startTime);
            const istSlotDate = new Date(slotDate.getTime() + istOffset);
            const slotDateStr = istSlotDate.toISOString().split('T')[0];
            return slotDateStr === dateStr;
        }).length;
    };

    if (futureDates.length === 0) {
        return null;
    }

    return (
        <div className="flex w-full justify-evenly border-b text-sm lg:text-base overflow-x-auto px-4">
            {futureDates.map((dateStr, index) => {
                const isSelected = selectedDate === dateStr;
                const slotCount = getSlotCount(dateStr);
                
                return (
                    <button
                        key={dateStr}
                        onClick={() => onDateSelect(dateStr)}
                        className={`pb-2 whitespace-nowrap transition-colors ${
                            isSelected
                                ? "border-b-2 border-accent text-accent font-medium"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {formatDateForDisplay(dateStr)}{" "}
                        <span className="text-green-500">
                            ({slotCount} Slot{slotCount !== 1 ? 's' : ''})
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default Page;
