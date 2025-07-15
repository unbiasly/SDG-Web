import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

const AddMentor = ({ onSave }: { onSave : (data: any) => void }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: "",
        name: "",
        specialization: "",
        gender: "",
        education: "",
        experience: "",
        slotDuration: "",
        availability: "",
        totalDuration: "",
        slotsPerDay: "",
    });

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setCalendarOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        const submitData = {
            ...formData,
            selectAvailability: selectedDate
        };
        onSave(submitData);
    };

    return (
        <form className="space-y-2">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Retail Sales Manager"
                    className="mt-1"
                />
            </div>

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Sarah Dewan"
                    className="mt-1"
                />
            </div>

            {/* Specialization */}
            <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                <Input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="Ex: Human Geography"
                    className="mt-1"
                />
            </div>

            {/* Gender */}
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange(value, "gender")}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Education */}
            <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
                <Select name="education" value={formData.education} onValueChange={(value) => handleSelectChange(value, "education")}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Experience */}
            <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                <Input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Enter years of experience"
                    className="mt-1"
                />
            </div>

            {/* Slot duration */}
            <div>
                <label htmlFor="slotDuration" className="block text-sm font-medium text-gray-700">Slot duration</label>
                <Select name="slotDuration" value={formData.slotDuration} onValueChange={(value) => handleSelectChange(value, "slotDuration")}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select slot duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="45">45 mins</SelectItem>
                        <SelectItem value="60">60 mins</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Availability */}
            <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                <Select name="availability" value={formData.availability} onValueChange={(value) => handleSelectChange(value, "availability")}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select availability time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="morning">Morning (09:00)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (14:00)</SelectItem>
                        <SelectItem value="evening">Evening (16:00)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Total mentorship duration */}
            <div>
                <label htmlFor="totalDuration" className="block text-sm font-medium text-gray-700">Total mentorship duration</label>
                <Select name="totalDuration" value={formData.totalDuration} onValueChange={(value) => handleSelectChange(value, "totalDuration")}>
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select total duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="5">5 hours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Total number of slots per day */}
            <div>
                <label htmlFor="slotsPerDay" className="block text-sm font-medium text-gray-700">Total number of slots per day</label>
                <Input
                    type="number"
                    id="slotsPerDay"
                    name="slotsPerDay"
                    value={formData.slotsPerDay}
                    onChange={handleInputChange}
                    placeholder="8"
                    className="mt-1"
                />
            </div>

            {/* Select availability */}
            <div className="space-y-2">
                <label htmlFor="selectAvailability" className="text-sm font-medium">
                    Select availability
                </label>
                <div className="relative">
                    <Button
                        variant="outline"
                        type="button"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                        )}
                        onClick={() => setCalendarOpen(!calendarOpen)}
                    >
                        {selectedDate ? (
                            format(selectedDate, "PPP")
                        ) : (
                            <span>Select available date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                    {calendarOpen && (
                        <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-2xl shadow-md">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                disabled={(date) => {
                                    // Disable past dates
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                }}
                                className="p-3 pointer-events-auto"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/80 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default AddMentor;
