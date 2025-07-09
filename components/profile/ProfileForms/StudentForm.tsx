"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Society } from "@/service/api.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentFormProps {
    onSubmit?: (data: StudentFormData) => void;
    className?: string;
}

interface StudentFormData {
    name: string;
    phone: string;
    email: string;
    college: string;
    major: string;
    isSDGMember: boolean;
    society_id: string;
    title: string;
}


const StudentForm: React.FC<StudentFormProps> = ({ 
    onSubmit,
    className 
}) => {
    const [formData, setFormData] = useState<StudentFormData>({
        name: "",
        phone: "",
        email: "",
        college: "",
        major: "",
        isSDGMember: false,
        society_id: "",
        title: ""
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [societies, setSocieties] = useState<Society[]>([]);
    const [isLoadingSocieties, setIsLoadingSocieties] = useState(false);

    // Fetch societies on component mount
    useEffect(() => {
        getSocietyList();
    }, []);

    const getSocietyList = async () => {
        try {
            setIsLoadingSocieties(true);
            // Replace with your actual API call
            // const response = await sdgMemberService.getSdgSocietyList('');
            // setSocieties(response.data || []);
            const response = await fetch('/api/society'); 
            const data = await response.json();

            setSocieties(data.data || []);
        } catch (error) {
            console.error("Failed to fetch societies:", error);
        } finally {
            setIsLoadingSocieties(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user makes selection
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const validateInputs = (): boolean => {
        const { name, phone, email, college, society_id, title } = formData;
        
        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();
        const trimmedCollege = college.trim();
        const trimmedTitle = title.trim();

        if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedCollege || !society_id || !trimmedTitle) {
            setErrorMessage("Please fill all required fields.");
            return false;
        }

        if (!/^[+]?[\d\s-()]{10,}$/.test(trimmedPhone.replace(/\s/g, ''))) {
            setErrorMessage("Enter a valid phone number.");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setErrorMessage("Enter a valid email address.");
            return false;
        }

        setErrorMessage(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateInputs()) {
            try {
                const response = await fetch('/api/login/onboarding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        role_type: "student",
                        name: formData.name.trim(),
                        phone: formData.phone.trim(),
                        email: formData.email.trim(),
                        college: formData.college.trim(),
                        major: formData.major.trim(),
                        isSDGMember: formData.isSDGMember,
                        society_id: formData.society_id,
                        designation: formData.title.trim(),
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Registration successful - proceed with navigation
                } else {
                    // Handle registration failure with user-friendly error
                    setErrorMessage(data.message || "Registration failed. Please try again.");
                    return;
                }
                
                onSubmit?.(formData);
                
                // Navigate to home page on success
                // router.push('/');
            } catch (error) {
                setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className={`bg-white ${className}`}>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
                {/* Name Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Name*
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* Contact Number Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Contact number*
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* College Email Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        College email ID*
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your College email ID"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* College/University Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        College/University*
                    </label>
                    <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="Enter your college/university name"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* Major/Program Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Major/Program of study
                    </label>
                    <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        placeholder="Enter your major/program"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* SDG Member Checkbox */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="isSDGMember"
                        id="isSDGMember"
                        checked={formData.isSDGMember}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-accent bg-gray-100 border-gray-300 rounded focus:ring-accent focus:ring-2"
                    />
                    <label htmlFor="isSDGMember" className="text-gray-700 font-medium">
                        I am a part of the SDG society
                    </label>
                </div>

                {/* Society/Goal Dropdown */}
                {societies.length > 0 && (
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                            Society*
                        </label>
                        
                        <Select
                            name="society_id"
                            value={formData.society_id}
                            onValueChange={(value) => {
                                setFormData(prev => ({
                                    ...prev,
                                    society_id: value
                                }));
                                if (errorMessage) {
                                    setErrorMessage(null);
                                }
                            }}
                        >
                            <SelectTrigger className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all">
                                <SelectValue placeholder="Select Society/Goal" />
                            </SelectTrigger>
                            <SelectContent>
                                {societies.map((society) => (
                                    <SelectItem key={society._id} value={society._id}>
                                        {society.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isLoadingSocieties && (
                            <p className="text-gray-500 text-sm mt-1">Loading societies...</p>
                        )}
                    </div>
                )}

                {/* Title in Society Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Title in Society*
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter your title in society"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="text-red-500 text-sm font-medium">
                        {errorMessage}
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full bg-accent text-white py-5 rounded-full font-semibold text-lg hover:bg-accent/80 transition-colors"
                >
                    Continue
                </Button>
            </form>
        </div>
    );
};

export default StudentForm;