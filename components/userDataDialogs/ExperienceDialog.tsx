import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Experience } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (experience: Experience, index?: number, isDeleted?: boolean) => void;
  experience?: Experience;
  index?: number;
}

export const ExperienceDialog: React.FC<ExperienceDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  experience,
  index,
}) => {
  const [experienceData, setExperienceData] = useState<Experience>(
    experience || {
      company: "",
      role: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    }
  );
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState<boolean>(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user } = useUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExperienceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setExperienceData((prev) => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // First update the experience entry via API
      await updateExperience();
      // Then call the parent component's onSave callback
      onSave(experienceData, index);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExperience = async () => {
    const endpoint = '/api/careerUpdate';
    const method = "PUT";
    
    // Prepare the updated experience array
    let updatedExperiences = [...(user?.experience || [])];
    
    if (index !== undefined) {
      // Edit existing experience
      updatedExperiences[index] = experienceData;
    } else {
      // Add new experience
      updatedExperiences.push(experienceData);
    }
    
    // Prepare the request body
    const requestBody = {
      username: user?.username,
      name: user?.name,
      location: user?.location,
      gender: user?.gender,
      dob: user?.dob,
      bio: user?.bio,
      portfolioLink: user?.portfolioLink,
      education: user?.education || [],
      experience: updatedExperiences
    };
    
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update experience');
    }
    
    return await response.json();
  };
  
  // Delete function using array index
  const handleDelete = async () => {
    if (index === undefined) return;
    
    setIsSubmitting(true);
    try {
      // Create a copy of the experience array
      let updatedExperiences = [...(user?.experience || [])];
      
      // Remove the experience at the specified index
      updatedExperiences.splice(index, 1);
      
      // Prepare request body
      const requestBody = {
        username: user?.username,
        name: user?.name,
        location: user?.location,
        gender: user?.gender,
        dob: user?.dob,
        bio: user?.bio,
        portfolioLink: user?.portfolioLink,
        education: user?.education || [],
        experience: updatedExperiences
      };
      
      // Send API request
      const response = await fetch('/api/careerUpdate', {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete experience');
      }
      
      // Close dialog and notify parent with the deleted index
      onOpenChange(false);
      onSave(experienceData, index, true);
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            {index !== undefined ? "Edit experience" : "Add experience"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">* Indicates required</p>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Company */}
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company<span className="text-red-500">*</span>
            </label>
            <Input
              id="company"
              name="company"
              placeholder="Ex: Unbiasly"
              value={experienceData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role<span className="text-red-500">*</span>
            </label>
            <Input
              id="role"
              name="role"
              placeholder="Ex: Software Engineer"
              value={experienceData.role}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !experienceData.startDate && "text-muted-foreground"
                )}
                onClick={() => setStartDateCalendarOpen(!startDateCalendarOpen)}
              >
                {experienceData.startDate ? (
                  format(new Date(experienceData.startDate), "PPP")
                ) : (
                  <span>Start Date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
              {startDateCalendarOpen && (
                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={experienceData.startDate ? new Date(experienceData.startDate) : undefined}
                    onSelect={(date) => {
                      handleDateChange("startDate", date);
                      setStartDateCalendarOpen(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </div>
              )}
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !experienceData.endDate && "text-muted-foreground"
                )}
                onClick={() => setEndDateCalendarOpen(!endDateCalendarOpen)}
              >
                {experienceData.endDate ? (
                  format(new Date(experienceData.endDate), "PPP")
                ) : (
                  <span>End Date (or expected)</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
              {endDateCalendarOpen && (
                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={experienceData.endDate ? new Date(experienceData.endDate) : undefined}
                    onSelect={(date) => {
                      handleDateChange("endDate", date);
                      setEndDateCalendarOpen(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between">
          {index !== undefined && (
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
          <div className={index !== undefined ? "" : "ml-auto"}>
            <Button 
              onClick={handleSave} 
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              disabled={
                isSubmitting || 
                !experienceData.company || 
                !experienceData.role || 
                !experienceData.startDate || 
                !experienceData.endDate
              }
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};