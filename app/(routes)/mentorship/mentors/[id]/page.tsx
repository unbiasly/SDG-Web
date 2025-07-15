"use client";
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import { ContentFeed } from "@/components/feed/ContentFeed";
import { TestimonialCard } from "@/components/mentorship/TestimonialCard";
import { MENTOR_PROFILE_TABS } from "@/lib/constants/index-constants";
import { CategoryMentor, MentorReview } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [mentor, setMentor] = useState<CategoryMentor | null>(null);
    const [reviews, setReviews] = useState<MentorReview[]>([]);
    const [activeMentorTab, setActiveMentorTab] = useState("Book a slot");
    const [isLoadingMentor, setIsLoadingMentor] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

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

    useEffect(() => {
        fetchReviews();
        getMentors();
    }, [id]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-4">
                <BackPageHeader headerTitle="Mentor Profile" />
                
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
                        <Image
                            src={mentor?.user.profileImage || "/placeholder.png"}
                            alt={mentor?.user.name || "Mentor Profile Image"}
                            className="aspect-square rounded-3xl object-cover"
                            width={200}
                            height={200}
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
                            ) : (
                                <p className="text-lg text-muted-foreground">
                                    Book a consultation slot with {mentor?.user.name}.
                                </p>
                            )}
                        </div>
                    )}

                    {activeMentorTab === "Student's Testimonials" && (
                        <div className="space-y-2">
                            {isLoadingReviews ? (
                                // Skeleton for testimonials
                                <div className="space-y-4">
                                    {[1, 2, 3].map((index) => (
                                        <div key={index} className="border rounded-lg p-4 space-y-3">
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
                                    <TestimonialCard key={review._id} review={review} />
                                ))
                            ) : (
                                <p className="text-muted-foreground">
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

export default Page;
