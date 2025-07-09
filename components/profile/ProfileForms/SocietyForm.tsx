"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface SocietyFormProps {
    onSubmit?: (data: SocietyFormData) => void;
    className?: string;
}

interface SocietyFormData {
    name: string;
    phone: string;
    email: string;
    college: string;
}

const SocietyForm: React.FC<SocietyFormProps> = ({ 
    onSubmit,
    className 
}) => {
    const [formData, setFormData] = useState<SocietyFormData>({
        name: "",
        phone: "",
        email: "",
        college: ""
    });

    const [errorText, setErrorText] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errorText) {
            setErrorText(null);
        }
    };

    const validateInputs = (): boolean => {
        const { name, phone, email, college } = formData;
        
        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();
        const trimmedCollege = college.trim();

        if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedCollege) {
            setErrorText("Please fill all required fields.");
            return false;
        }

        if (!/^\d{10}$/.test(trimmedPhone)) {
            setErrorText("Enter a valid 10-digit phone number.");
            return false;
        }

        if (!/^[\w.-]+@([\w-]+\.)+[\w]{2,4}$/.test(trimmedEmail)) {
            setErrorText("Enter a valid email address.");
            return false;
        }

        return true;
    };

    const registerSociety = async () => {
        try {
            
            const response = await fetch('/api/login/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role_type: "sdg-society",
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    college: formData.college.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Society registration successful:", data);
                onSubmit?.(formData);
            } else {
                console.error("Society registration failed:", data);
                setErrorText(data.message || "Registration failed. Please try again.");
            }
            // Navigate to home page on success
            // router.push('/');
        } catch (error) {
            setErrorText("Registration failed. Please try again.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateInputs()) {
            registerSociety();
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

                {/* Official Email Field */}
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                        Official email ID*
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your official email ID"
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

                {/* Error Message */}
                {errorText && (
                    <div className="text-red-500 text-sm font-medium">
                        {errorText}
                    </div>
                )}

                {/* Submit Button */}
                <DialogClose asChild>
                    <Button type="submit" className="w-full bg-accent text-white py-5 rounded-full font-semibold text-lg hover:bg-accent/80 transition-colors">
                        Continue
                    </Button>
                </DialogClose>
            </form>
        </div>
    );
};

export default SocietyForm;