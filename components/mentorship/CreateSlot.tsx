import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Calendar24 } from "../ui/date-time";
import { AppApi } from "@/service/app.api";

interface CreateSlotFormData {
	mentor_id: string;
	time: Date | undefined;
	duration: number;
}

const CreateSlot = ({ mentorId, onSuccess }: { mentorId: string, onSuccess: () => void }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState<CreateSlotFormData>({
		mentor_id: mentorId,
		time: undefined,
		duration: 15,
	});

	// Use useCallback to prevent function recreation on every render
	const handleDateTimeChange = useCallback((date: Date | undefined, time: string) => {
		if (date && time) {
			const [hours, minutes] = time.split(':').map(Number);
			const dateTime = new Date(date);
			dateTime.setHours(hours, minutes, 0, 0);
			
			setFormData(prev => ({
				...prev,
				time: dateTime
			}));
		}
	}, []);

	const handleSelectChange = useCallback((value: string, field: string) => {
		if (field === "duration") {
			setFormData(prev => ({
				...prev,
				duration: parseInt(value)
			}));
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.time || !formData.duration) {
			console.error("Missing required fields");
			return;
		}

        try {
            const response = await AppApi.createSlot(formData.mentor_id, formData.time, formData.duration);
            if (!response.success) {
                console.error("Failed to create slot:", response.error);
                return;
            }
            onSuccess(); 
            console.log("Slot created successfully:", response.data);
            setIsOpen(false);
            // Reset form
            setFormData({
                mentor_id: mentorId,
                time: undefined,
                duration: 15,
            });
        } catch (error) {
            console.error("Error creating slot:", error);
        }
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild className="hover:bg-gray-200 p-1 text-white rounded-lg cursor-pointer"><Plus /></DialogTrigger>
			<DialogContent showDialogClose={false} className="p-0">
				<DialogHeader className="flex flex-row justify-between items-center p-6 pb-4 border-b">
					<DialogTitle className="text-lg font-semibold">Create New Slot</DialogTitle>
					<DialogClose className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors">
						<X  />
					</DialogClose>
				</DialogHeader>

                <form className="space-y-4 p-6" onSubmit={handleSubmit}>
                    {/* Duration */}
                    <div className="space-y-2">
                        <label
                            htmlFor="duration"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Slot Duration <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="duration"
                            value={formData.duration.toString()}
                            onValueChange={(value) => handleSelectChange(value, "duration")}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select slot duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date and Time Selection */}
                    <Calendar24 onDateTimeChange={handleDateTimeChange} />

                    {/* Submit button */}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            className="bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-accent/90 transition-colors font-medium"
                            disabled={!formData.duration || !formData.time}
                        >
                            Create Slot
                        </button>
                    </div>
                </form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateSlot;