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
import { toast } from "sonner";

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (experience: Experience, id?: string, isDeleted?: boolean) => void;
  experience?: Experience;
  index?: number; // We'll convert this to use _id instead of index
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
      _id: crypto.randomUUID(), // Generate a temporary ID for new entries
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
      // First update the experience via API
      await updateUserWithExperience(false);
      
      // Then call the parent component's onSave callback
      onSave(experienceData, experienceData._id);
      onOpenChange(false);
      toast.success("Experience saved successfully");
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error("Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserWithExperience = async (isDelete: boolean) => {
    if (!user) return;
    
    // Create a copy of the user's existing experience array or empty array
    let updatedExperiences = [...(user.experience || [])];
    
    if (isDelete && experience?._id) {
      // For delete operations, filter out by ID
      updatedExperiences = updatedExperiences.filter(exp => exp._id !== experience._id);
    } else if (experience?._id) {
      // For edit operations, find by ID and update
      const idx = updatedExperiences.findIndex(exp => exp._id === experience._id);
      if (idx !== -1) {
        updatedExperiences[idx] = experienceData;
      } else {
        // If not found, add it
        updatedExperiences.push(experienceData);
      }
    } else {
      // For new entries, push to array
      updatedExperiences.push(experienceData);
    }
    
    // Prepare complete user data for the API
    const userData = {
      // Include all required user fields
      name: user.name || "",
      fName: user.fName || "",
      lName: user.lName || "",
      username: user.username || "",
      location: user.location || "",
      gender: user.gender || "",
      dob: user.dob || new Date().toISOString(),
      bio: user.bio || "",
      occupation: user.occupation || "",
      pronouns: user.pronouns || "",
      headline: user.headline || "",
      portfolioLink: user.portfolioLink || "",
      // Update the experience array, keep education the same
      education: user.education || [],
      experience: updatedExperiences
    };
    
    // Call the User Details API
    const response = await fetch('/api/career', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update experience');
    }
    
    return await response.json();
  };
  
  const handleDelete = async () => {
    if (!experience?._id) return;
    
    setIsSubmitting(true);
    try {
      // Update user details by removing this experience entry
      await updateUserWithExperience(true);
      
      // Call parent's callback with deleted flag
      onOpenChange(false);
      onSave(experienceData, experience._id, true);
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error("Failed to delete experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            {experience?._id ? "Edit experience" : "Add experience"}
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
          {experience?._id && (
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={isSubmitting}
            >
              Delete
            </Button>
          )}
          <div className={experience?._id ? "" : "ml-auto"}>
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