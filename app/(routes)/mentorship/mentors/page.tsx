"use client";
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppApi } from "@/service/app.api";
import { MentorProfileCard } from "@/components/mentorship/MentorProfileCard";
import { CategoryMentor } from "@/service/api.interface";

// Extract the component that uses useSearchParams
const MentorsContent = () => {
    const [mentors, setMentors] = useState<CategoryMentor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category");

    const getMentors = async () => {
        try {
            setIsLoading(true);
            const response = await AppApi.getMentors(categoryId || "");
            if (response.success) {
                setMentors(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching mentors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMentors();
    }, [categoryId]);

    return (
        <div className="p-2 flex flex-col gap-4">
            {isLoading ? (
                // Loading skeleton
                <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : mentors.length > 0 ? (
                mentors.map((mentor) => (
                    <MentorProfileCard key={mentor._id} mentor={mentor} />
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No mentors found for this category.</p>
                </div>
            )}
        </div>
    );
};

const Page = () => {
    return (
        <div>
            <BackPageHeader headerTitle="Mentor Profiles" />
            <Suspense fallback={
                <div className="p-2 flex flex-col gap-4">
                    <div className="space-y-4">
                        {[1, 2, 3].map((index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="flex-1">
                                        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }>
                <MentorsContent />
            </Suspense>
        </div>
    );
};

export default Page;
