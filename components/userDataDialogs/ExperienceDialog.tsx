import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Experience } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { isBefore, isEqual } from "date-fns";

// Change interface to match EducationDialog but for Experience
interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (experience: Experience, id?: string, isDeleted?: boolean) => void;
  experience?: Experience;
}

export const ExperienceDialog: React.FC<ExperienceDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  experience,
}) => {
  // Check for mobile screen
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Initialize experience data with provided experience or new default
  const [experienceData, setExperienceData] = useState<Experience>({
    _id: "",
    company: "",
    role: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });
  
  // Store the original data for comparison
  const [originalData, setOriginalData] = useState<Experience | null>(null);
  
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState<boolean>(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false);
  const [originallyWorking, setOriginallyWorking] = useState<boolean>(false);
  const [dateError, setDateError] = useState<string>("");
  
  const { user } = useUser();
  
  // Update local state when experience prop changes or dialog opens
  useEffect(() => {
    if (open) {
      if (experience) {
        const isCurrentJob = experience.endDate === "present" || 
                            experience.endDate === "Present" || 
                            experience.endDate === null;
        
        const newData = {
          _id: experience._id || "",
          company: experience.company || "",
          role: experience.role || "",
          startDate: experience.startDate || new Date().toISOString(),
          endDate: isCurrentJob ? new Date().toISOString() : (experience.endDate || new Date().toISOString()),
        };
        
        setExperienceData(newData);
        setOriginalData(newData);
        setCurrentlyWorking(isCurrentJob);
        setOriginallyWorking(isCurrentJob);
      } else {
        const defaultData = {
          _id: "",
          company: "",
          role: "",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        };
        setExperienceData(defaultData);
        setOriginalData(defaultData);
        setCurrentlyWorking(false);
        setOriginallyWorking(false);
      }
      setDateError("");
    }
  }, [experience, open]);

  // Check if form data has changed compared to original
  const hasChanges = () => {
    if (!originalData) return false;
    
    // Compare working status
    if (currentlyWorking !== originallyWorking) return true;
    
    // For new entries, any data is a change
    if (!experience?._id && (experienceData.company || experienceData.role)) return true;
    
    // Compare basic fields
    if (experienceData.company !== originalData.company) return true;
    if (experienceData.role !== originalData.role) return true;
    
    // Compare dates (handling ISO strings)
    const startDateEqual = new Date(experienceData.startDate).getTime() === new Date(originalData.startDate).getTime();
    if (!startDateEqual) return true;
    
    // Only compare end dates if not currently working
    if (!currentlyWorking && originalData.endDate) {
      const endDateEqual = new Date(experienceData.endDate || "").getTime() === new Date(originalData.endDate || "").getTime();
      if (!endDateEqual) return true;
    }
    
    return false;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExperienceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setExperienceData((prev) => ({ ...prev, [field]: date.toISOString() }));
      
      // Validate dates when either date changes
      if (field === "startDate" && experienceData.endDate && !currentlyWorking) {
        const startDate = date;
        const endDate = new Date(experienceData.endDate);
        if (!isBefore(startDate, endDate)) {
          setDateError("Start date must be before end date");
        } else {
          setDateError("");
        }
      } else if (field === "endDate" && experienceData.startDate) {
        const startDate = new Date(experienceData.startDate);
        const endDate = date;
        if (!isBefore(startDate, endDate)) {
          setDateError("Start date must be before end date");
        } else {
          setDateError("");
        }
      }
    }
    if (field === "startDate") setStartDateCalendarOpen(false);
    if (field === "endDate") setEndDateCalendarOpen(false);
  };

  const handleCurrentlyWorkingChange = (checked: boolean) => {
    setCurrentlyWorking(checked);
    if (checked) {
      // Clear any date validation errors
      setDateError("");
    }
  };

  /**
   * Updates the user's experience array on the server
   */
  const updateUserWithExperience = async (isDeleteOperation: boolean) => {
    if (!user) {
      toast.error("User data not available.");
      throw new Error("User data not available.");
    }

    let updatedExperiences = [...(user.experience || [])];
    const currentEntryId = experience?._id;

    if (isDeleteOperation) {
      if (!currentEntryId) {
        toast.error("Cannot delete an item without an ID.");
        throw new Error("Cannot delete an item without an ID.");
      }
      // Filter out the experience item to be deleted
      updatedExperiences = updatedExperiences.filter(exp => exp._id !== currentEntryId);
    } else {
      // Prepare experience data with "present" for currently working
      const preparedExperienceData = {
        ...experienceData,
        endDate: currentlyWorking ? "present" : experienceData.endDate
      };

      // This is an Add or Edit operation
      if (currentEntryId) {
        // Editing an existing experience
        const indexToUpdate = updatedExperiences.findIndex(exp => exp._id === currentEntryId);
        if (indexToUpdate !== -1) {
          updatedExperiences[indexToUpdate] = { ...preparedExperienceData, _id: currentEntryId };
        } else {
          toast.error("Experience not found in user profile.");
          throw new Error("Experience not found in user profile.");
        }
      } else {
        // Adding a new experience - strip out the empty ID field
        const { _id, ...experienceWithoutId } = preparedExperienceData; // Remove _id from the data
        updatedExperiences.push(experienceWithoutId);
      }
    }

    // Send the updated experience array to the server
    const response = await fetch('/api', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experience: updatedExperiences })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown server error" }));
      throw new Error(errorData.message || `Failed to update user details (status: ${response.status})`);
    }
    
    return await response.json();
  };

  const handleSave = async () => {
    // Basic validation
    if (!experienceData.company || !experienceData.role || !experienceData.startDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // End date validation (only if not currently working)
    if (!currentlyWorking && !experienceData.endDate) {
      toast.error("Please provide an end date or select 'I am currently working here'.");
      return;
    }
    
    // Date order validation
    if (!currentlyWorking && experienceData.startDate && experienceData.endDate) {
      const startDate = new Date(experienceData.startDate);
      const endDate = new Date(experienceData.endDate);
      if (!isBefore(startDate, endDate)) {
        setDateError("Start date must be before end date");
        toast.error("Start date must be before end date.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const updatedUserData = await updateUserWithExperience(false);
      
      // Use the custom event to notify the parent component
      window.dispatchEvent(new CustomEvent('user-profile-updated', { 
        detail: updatedUserData.data || updatedUserData
      }));
      
      // Prepare the experience data with proper "present" handling for the callback
      const resultExperienceData = {
        ...experienceData,
        endDate: currentlyWorking ? "present" : experienceData.endDate
      };
      
      // Call onSuccess to maintain component's expected behavior
      if (experience?._id) {
        onSuccess(resultExperienceData, experience._id, false);
      } else {
        // Try to find the newly added experience in the response
        const newExperience = (updatedUserData.data?.experience || updatedUserData.experience)?.find(
          (exp: Experience) => 
            exp.company === experienceData.company && 
            exp.role === experienceData.role && 
            (!experience || experience._id !== exp._id)
        );
        onSuccess(resultExperienceData, newExperience?._id || "", false);
      }
      
      onOpenChange(false);
      toast.success("Experience saved successfully!");
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error(error instanceof Error ? error.message : "Failed to save experience");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!experience?._id) {
      toast.error("No experience selected to delete.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedUserData = await updateUserWithExperience(true);
      
      // Use the custom event to notify the parent component
      window.dispatchEvent(new CustomEvent('user-profile-updated', { 
        detail: updatedUserData.data || updatedUserData
      }));
      
      // Call onSuccess to maintain component's expected behavior
      onSuccess(experienceData, experience._id, true);
      
      onOpenChange(false);
      toast.success("Experience deleted successfully!");
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Form content component to be shared between Dialog and Drawer
  const FormContent = () => (
    <>
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
            onKeyDown={handleKeyDown}
            className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
            onKeyDown={handleKeyDown}
            className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Start Date<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
                !experienceData.startDate && "text-muted-foreground dark:text-gray-400"
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
              <div className="absolute z-50 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                <Calendar
                  mode="single"
                  selected={experienceData.startDate ? new Date(experienceData.startDate) : undefined}
                  onSelect={(date) => handleDateChange("startDate", date)}
                  initialFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* Currently working checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="currentlyWorking" 
            checked={currentlyWorking} 
            onCheckedChange={handleCurrentlyWorkingChange} 
          />
          <label
            htmlFor="currentlyWorking"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I am currently working here
          </label>
        </div>

        {/* End Date - conditionally shown when not currently working */}
        {!currentlyWorking && (
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
                  !experienceData.endDate && "text-muted-foreground dark:text-gray-400"
                )}
                onClick={() => setEndDateCalendarOpen(!endDateCalendarOpen)}
              >
                {experienceData.endDate ? (
                  format(new Date(experienceData.endDate), "PPP")
                ) : (
                  <span>End Date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
              {endDateCalendarOpen && (
                <div className="absolute z-50 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                  <Calendar
                    mode="single"
                    selected={experienceData.endDate ? new Date(experienceData.endDate) : undefined}
                    onSelect={(date) => handleDateChange("endDate", date)}
                    initialFocus
                  />
                </div>
              )}
            </div>
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
          </div>
        )}
      </div>
    </>
  );

  // Footer content component to be shared between Dialog and Drawer
  const FooterContent = () => (
    <>
      {(experience?._id) && (
        <Button 
          type="button"
          onClick={handleDelete}
          variant="outline"
          className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900 dark:hover:text-red-300 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Delete
        </Button>
      )}
      <div className={cn("flex gap-2 w-full sm:w-auto", (experience?._id) ? "" : "ml-auto")}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
          className="w-1/2 sm:w-auto dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button 
          type="button"
          onClick={handleSave} 
          className="bg-accent hover:bg-accent/80 text-white px-6 sm:px-8 w-1/2 sm:w-auto"
          disabled={
            isSubmitting || 
            !experienceData.company || 
            !experienceData.role || 
            !experienceData.startDate || 
            (!currentlyWorking && !experienceData.endDate) ||
            !!dateError ||
            !hasChanges() // Disable if no changes detected
          }
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </>
  );

  // Conditionally render Dialog or Drawer based on screen size
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="border-b pb-4 dark:border-gray-700">
            <DrawerTitle className="text-xl font-bold">
              {experience?._id ? "Edit Experience" : "Add Experience"}
            </DrawerTitle>
            <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">* Indicates required</p>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto flex-1">
            <FormContent />
          </div>
          <DrawerFooter className="border-t pt-4 flex flex-col gap-2 dark:border-gray-700">
            <FooterContent />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!isSubmitting) onOpenChange(val); }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-black dark:text-white">
        <DialogHeader className="border-b pb-4 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold">
            {experience?._id ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">* Indicates required</p>
        </DialogHeader>
        <FormContent />
        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 dark:border-gray-700">
          <FooterContent />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};