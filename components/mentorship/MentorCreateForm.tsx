'use client';
import React, { useState, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AppApi } from "@/service/app.api";
import { TimeSlot } from "./TimeSlot";
import { MENTOR_CATEGORIES } from "@/lib/constants/index-constants";
import { useUser } from "@/lib/redux/features/user/hooks";
import Image from "next/image";
import ProfileAvatar from "../profile/ProfileAvatar";
import { MentorRequestData } from "@/service/api.interface";



const MentorCreateForm = () => {
    const [currentView, setCurrentView] = useState<"mentor" | "preview">("mentor");
    const { user } = useUser();
    const [mentorData, setMentorData] = useState<MentorRequestData>({
        user_id: "",
        category_id: "",
        title: "",
        name: "",
        shortDesc: "",
        gender: "",
        slot_duration_in_min: 0,
        experience: "",
        slot_per_day: 0,
        availability: new Date(),
        specialization: ""
    });
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Only access document on client side
        const userIdFromCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('userId='))
            ?.split('=')[1] || "";
        setUserId(userIdFromCookie);
        setMentorData(prev => ({
            ...prev,
            user_id: userIdFromCookie
        }));
    }, []);
    
    // Form state for date picker
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);



    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setMentorData(prev => ({
                ...prev,
                availability: date
            }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'slot_duration_in_min' || name === 'slot_per_day') {
            setMentorData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0
            }));
        } else {
            setMentorData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (value: string, field: string) => {
        if (field === 'slot_duration_in_min' || field === 'slot_per_day') {
            setMentorData(prev => ({
                ...prev,
                [field]: parseInt(value) || 0
            }));
        } else {
            setMentorData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSave = async () => {
        // Generate short description if not provided
        if (!mentorData.shortDesc) {
            const generatedDesc = `${mentorData.experience} experience in ${mentorData.specialization}`;
            setMentorData(prev => ({ ...prev, shortDesc: generatedDesc }));
        }
        
        setCurrentView("preview");
    };

    const handleCreateMentor = async () => {
        try {
            const response = await AppApi.createMentor(mentorData);
            if (response.success) {
                console.log("Mentor created successfully", response.data);
                setIsOpen(false);
                // Reset form
                setMentorData({
                    user_id: userId || "",
                    category_id: "",
                    title: "",
                    name: "",
                    shortDesc: "",
                    gender: "",
                    slot_duration_in_min: 0,
                    experience: "",
                    slot_per_day: 0,
                    availability: new Date(),
                    specialization: ""
                });
                setSelectedDate(undefined);
                setCurrentView("mentor");
            } else {
                console.error("Failed to create mentor", response.error);
            }
        } catch (error) {
            console.error("Error creating mentor:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="bg-[#22a1dd] px-4 py-2 rounded-2xl text-white w-full cursor-pointer hover:bg-[#1e8fc7] transition-colors">
                    Become a Mentor
                </button>
            </DialogTrigger>
            <DialogContent showDialogClose={false} className="max-w-2xl max-h-[90vh] overflow-y-auto hidden-scrollbar p-0">
                <DialogHeader className="flex flex-row justify-between items-center p-6 pb-4 border-b">
                    <DialogTitle className="text-xl font-semibold">Create Mentor Profile</DialogTitle>
                    <DialogClose className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </DialogClose>
                </DialogHeader>
                
                <div className="p-6">
                    {currentView === "mentor" && (
                        <form className="space-y-4">
                            {/* Title - Required */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={mentorData.title || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Mr, Ms, Dr"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Name - Required */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={mentorData.name || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Sarah Dewan"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Specialization - Required */}
                            <div className="space-y-2">
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                                    Specialization <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    id="specialization"
                                    name="specialization"
                                    value={mentorData.specialization || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Human Geography, Software Development"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Short Description - Required */}
                            <div className="space-y-2">
                                <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700">
                                    Short Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="shortDesc"
                                    name="shortDesc"
                                    value={mentorData.shortDesc || ""}
                                    onChange={handleInputChange}
                                    placeholder="Brief description about your expertise and what you can help with..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Gender - Single column */}
                            <div className="space-y-2">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <Select name="gender" value={mentorData.gender || ""} onValueChange={(value) => handleSelectChange(value, "gender")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Please select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Experience - Single column */}
                            <div className="space-y-2">
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                    Experience (years) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    id="experience"
                                    name="experience"
                                    value={mentorData.experience || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 5"
                                    min="0"
                                    max="50"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Slot Duration - Single column */}
                            <div className="space-y-2">
                                <label htmlFor="slot_duration_in_min" className="block text-sm font-medium text-gray-700">
                                    Slot Duration (minutes) <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    id="slot_duration_in_min"
                                    name="slot_duration_in_min"
                                    value={mentorData.slot_duration_in_min || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 30"
                                    min="15"
                                    max="120"
                                    step="15"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Slots per Day - Single column */}
                            <div className="space-y-2">
                                <label htmlFor="slot_per_day" className="block text-sm font-medium text-gray-700">
                                    Slots per Day <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    id="slot_per_day"
                                    name="slot_per_day"
                                    value={mentorData.slot_per_day || ""}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 8"
                                    min="1"
                                    max="20"
                                    className="w-full"
                                    required
                                />
                            </div>

                            {/* Date Picker for Availability */}
                            <div className="space-y-2">
                                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                                    Availability Date <span className="text-red-500">*</span>
                                </label>
                                <DatePicker
                                    selected={selectedDate}
                                    onSelect={handleDateChange}
                                    placeholder="Select available date"
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today;
                                    }}
                                    className="w-full"
                                />
                            </div>

                            {/* Category - Optional */}
                            <div className="space-y-2">
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                                    Category (Optional)
                                </label>
                                <Select name="category_id" value={mentorData.category_id || ""} onValueChange={(value) => handleSelectChange(value, "category_id")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MENTOR_CATEGORIES.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Submit button */}
                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-accent/90 transition-colors font-medium"
                                    disabled={!mentorData.title || !mentorData.name || !mentorData.specialization || !mentorData.shortDesc || !mentorData.gender || !mentorData.experience || !mentorData.slot_duration_in_min || !mentorData.slot_per_day || !mentorData.availability}
                                >
                                    Preview Profile
                                </button>
                            </div>
                        </form>
                    )}
                    
                    {currentView === "preview" && mentorData && (
                        <div className="space-y-6">
                            {/* Mentor Details Section */}
                            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-accent">Mentor Details</h3>
                                    <button 
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                        onClick={() => setCurrentView("mentor")}
                                        aria-label="Edit mentor details"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.828-2.828z"></path>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="flex items-start space-x-4">
                                    <ProfileAvatar src={user?.profileImage || ''} alt={`${mentorData.name} - Mentor`} roundedBorder="rounded-lg" userName={mentorData.name} />
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-semibold text-gray-900">
                                            {mentorData.title} {mentorData.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {mentorData.gender} • {mentorData.experience} experience
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Specialist in {mentorData.specialization}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional mentor information */}
                                {/* <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">Slot Duration</p>
                                        <p className="text-sm text-gray-900">{mentorData.slot_duration_in_min} minutes</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">Slots per Day</p>
                                        <p className="text-sm text-gray-900">{mentorData.slot_per_day} slots</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">Availability Date</p>
                                        <p className="text-sm text-gray-900">
                                            {mentorData.availability ? format(new Date(mentorData.availability), "PPP") : "Not selected"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-gray-500">User ID</p>
                                        <p className="text-sm text-gray-900 font-mono">{mentorData.user_id}</p>
                                    </div>
                                </div> */}

                                {/* Category info */}
                                {/* {mentorData.category_id && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-gray-500">Category</p>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                                                {mentorData.category_id}
                                            </span>
                                        </div>
                                    </div>
                                )} */}
                            </div>

                            {/* Slots Section */}
                            <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                                <h3 className="text-lg font-bold text-accent">
                                    Available Slots ({mentorData.slot_per_day} per day)
                                </h3>


                                {/* Date tabs */}
                                <div className="flex border-b text-sm gap-3 overflow-x-auto">
                                    <button className="pb-2 border-b-2 border-[#2563eb] text-[#2563eb] font-medium whitespace-nowrap">
                                        {mentorData.availability ? format(new Date(mentorData.availability), "MMM dd") : "Selected Date"} 
                                        <span className="text-green-500"> ({mentorData.slot_per_day} Slots)</span>
                                    </button>
                                    <button className="pb-2 text-gray-500 whitespace-nowrap">
                                        Next Day <span className="text-green-500">({mentorData.slot_per_day} Slots)</span>
                                    </button>
                                    <button className="pb-2 text-gray-500 whitespace-nowrap">
                                        Day +2 <span className="text-green-500">({mentorData.slot_per_day} Slots)</span>
                                    </button>
                                </div>

                                {/* Time slots - Generate based on slot configuration */}
                                <div className="flex flex-wrap gap-3">
                                    {Array.from({ length: mentorData.slot_per_day || 0 }, (_, index) => {
                                        // Generate time slots starting from 9:00 AM
                                        const baseHour = 9;
                                        const slotStartTime = new Date();
                                        slotStartTime.setHours(baseHour + Math.floor((index * (mentorData.slot_duration_in_min || 30)) / 60));
                                        slotStartTime.setMinutes((index * (mentorData.slot_duration_in_min || 30)) % 60);
                                        
                                        const timeString = slotStartTime.toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                            hour12: false 
                                        });
                                        
                                        return (
                                            <TimeSlot key={index} time={timeString} available selected />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <button 
                                    className="text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    onClick={() => setCurrentView("mentor")}
                                >
                                    Back to Edit
                                </button>
                                <button 
                                    className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                                    onClick={handleCreateMentor}
                                >
                                    Create Mentor Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MentorCreateForm;
