"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface PublicRepresentativeFormProps {
    onSubmit?: (data: PublicRepresentativeFormData) => void;
    className?: string;
}

interface PublicRepresentativeFormData {
    name: string;
    contactNumber: string;
    officialEmail: string;
    ministry: string;
    posting: string;
    department: string;
    uid: string;
}

const PublicRepresentativeForm: React.FC<PublicRepresentativeFormProps> = ({ 
    onSubmit,
    className 
}) => {
    const [formData, setFormData] = useState<PublicRepresentativeFormData>({
        name: "",
        contactNumber: "",
        officialEmail: "",
        ministry: "",
        posting: "",
        department: "",
        uid: ""
    });

    const [errors, setErrors] = useState<Partial<PublicRepresentativeFormData>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name as keyof PublicRepresentativeFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<PublicRepresentativeFormData> = {};

        // Required field validation
        if (!formData.name.trim()) newErrors.name = "This field is required";
        if (!formData.contactNumber.trim()) newErrors.contactNumber = "This field is required";
        if (!formData.officialEmail.trim()) newErrors.officialEmail = "This field is required";
        if (!formData.ministry.trim()) newErrors.ministry = "This field is required";
        if (!formData.posting.trim()) newErrors.posting = "This field is required";
        if (!formData.department.trim()) newErrors.department = "This field is required";
        if (!formData.uid.trim()) newErrors.uid = "This field is required";

        // Email validation
        if (formData.officialEmail.trim()) {
            const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailPattern.test(formData.officialEmail.trim())) {
                newErrors.officialEmail = "Enter a valid email";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const response = await fetch('/api/login/onboarding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        role_type: "public-representative",
                        name: formData.name.trim(),
                        phone: formData.contactNumber.trim(),
                        email: formData.officialEmail.trim(),
                        ministry: formData.ministry.trim(),
                        posting: formData.posting.trim(),
                        department: formData.department.trim(),
                        uid: formData.uid.trim(),
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                onSubmit?.(formData);
                
            } catch (error) {
                console.error("Registration error:", error);
                // You may want to add error state handling here
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
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Contact Number Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Contact number*
                    </label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                    )}
                </div>

                {/* Official Email Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Official email ID*
                    </label>
                    <input
                        type="email"
                        name="officialEmail"
                        value={formData.officialEmail}
                        onChange={handleInputChange}
                        placeholder="Enter your official email ID"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.officialEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.officialEmail}</p>
                    )}
                </div>

                {/* Ministry Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Ministry*
                    </label>
                    <input
                        type="text"
                        name="ministry"
                        value={formData.ministry}
                        onChange={handleInputChange}
                        placeholder="Enter ministry"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.ministry && (
                        <p className="text-red-500 text-sm mt-1">{errors.ministry}</p>
                    )}
                </div>

                {/* Posting Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Posting*
                    </label>
                    <input
                        type="text"
                        name="posting"
                        value={formData.posting}
                        onChange={handleInputChange}
                        placeholder="Enter posting"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.posting && (
                        <p className="text-red-500 text-sm mt-1">{errors.posting}</p>
                    )}
                </div>

                {/* Department Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Department*
                    </label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter department"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.department && (
                        <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                    )}
                </div>

                {/* UID Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        UID*
                    </label>
                    <input
                        type="text"
                        name="uid"
                        value={formData.uid}
                        onChange={handleInputChange}
                        placeholder="Enter UID"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    />
                    {errors.uid && (
                        <p className="text-red-500 text-sm mt-1">{errors.uid}</p>
                    )}
                </div>

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

export default PublicRepresentativeForm;