'use client';
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import { MentorshipCard } from "@/components/mentorship/MentorshipCard";
import { MentorshipCategory } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [categories, setCategories] = useState<MentorshipCategory[]>([]);

    const getCategories = async () => {
        try {
            const response = await AppApi.getMentorshipCategories();

            if (response.success) {
                setCategories(response.data.data);
            } else {
                console.error("Failed to fetch mentorship categories:", response.data);
            }
        } catch (error) {
            console.error("Error fetching mentorship categories:", error);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="">
            <BackPageHeader headerTitle="Mentorship" />
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                    {categories.map((category) => (
                        <MentorshipCard key={category._id} category={category} />
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Page;
