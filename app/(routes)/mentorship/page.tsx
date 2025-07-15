'use client';
import BackPageHeader from "@/components/custom-ui/BackPageHeader";
import MentorCreateForm from "@/components/mentorship/MentorCreateForm";
import { MentorshipCard } from "@/components/mentorship/MentorshipCard";
import { MentorshipCategory } from "@/service/api.interface";
import { AppApi } from "@/service/app.api";
import React, { useEffect, useState } from "react";

const Page = () => {
    const [categories, setCategories] = useState<MentorshipCategory[]>([]);
    const [userRole, setUserRole] = useState<string>('');
    
        useEffect(() => {
            const roleType = document.cookie
                .split('; ')
                .find(row => row.startsWith('role_type='))
                ?.split('=')[1];
            setUserRole(roleType || '');
        }, []);
    
    const canBeMentor = userRole === 'public-representative';

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
        <div className="h-screen flex flex-col">
            <BackPageHeader headerTitle="Mentorship" />
            <div className="flex-1 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                    {categories.map((category) => (
                        <MentorshipCard key={category._id} category={category} />
                    ))}
                </div>
            </div>
            {canBeMentor && (
                <div className="p-5">
                    <MentorCreateForm />
                </div>
            )}
        </div>
    );
};

export default Page;
