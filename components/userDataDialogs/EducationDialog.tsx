import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Education } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (education: Education, index?: number) => void;
  education?: Education;
  index?: number;
}

export const EducationDialog: React.FC<EducationDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  education,
  index,
}) => {
  const [educationData, setEducationData] = useState<Education>(
    education || {
      school: "",
      degree: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    }
  );
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState<boolean>(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    user,
  } = useUser()

  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEducationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setEducationData((prev) => ({ ...prev, [field]: date.toISOString() }));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // First update the education entry via API
      await updateEducation();
      // Then call the parent component's onSave callback
      onSave(educationData, index);
      onOpenChange(false);
    //   ({
    //     title: education?._id ? "Education updated" : "Education added",
    //     description: "Your education details have been saved successfully.",
    //   });
    } catch (error) {
      console.error('Error saving education:', error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to save education details. Please try again.",
    //     variant: "destructive",
    //   });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEducation = async () => {
    const endpoint = '/api/careerUpdate';
    const method = "PUT";
    
    // Prepare the updated education array
    let updatedEducations = [...(user?.education || [])];
    
    if (index !== undefined) {
      // Edit existing education
      updatedEducations[index] = educationData;
    } else {
      // Add new education
      updatedEducations.push(educationData);
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
      education: updatedEducations,
      experience: user?.experience || []
    };
    
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update education');
    }
    
    return await response.json();
  };

  // Delete function using array index
  const handleDelete = async () => {
    if (index === undefined) return;
    
    setIsSubmitting(true);
    try {
      // Create a copy of the education array
      let updatedEducations = [...(user?.education || [])];
      
      // Remove the education at the specified index
      updatedEducations.splice(index, 1);
      
      // Prepare request body
      const requestBody = {
        username: user?.username,
        name: user?.name,
        location: user?.location,
        gender: user?.gender,
        dob: user?.dob,
        bio: user?.bio,
        portfolioLink: user?.portfolioLink,
        education: updatedEducations,
        experience: user?.experience || []
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
        throw new Error('Failed to delete education');
      }
      
      // Close dialog and notify parent with the deleted index
      onOpenChange(false);
      onSave(educationData, index);
    } catch (error) {
      console.error('Error deleting education:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          {/* <div className="flex justify-between items-center w-full">
          </div> */}
            <DialogTitle className="text-xl font-bold">
              {index !== undefined ? "Edit education" : "Add education"}
            </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">* Indicates required</p>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* School */}
          <div className="space-y-2">
            <label htmlFor="school" className="text-sm font-medium">
              School<span className="text-red-500">*</span>
            </label>
            <Input
              id="school"
              name="school"
              placeholder="Ex: Delhi University"
              value={educationData.school}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <label htmlFor="degree" className="text-sm font-medium">
              Degree<span className="text-red-500">*</span>
            </label>
            <Input
              id="degree"
              name="degree"
              placeholder="Ex: Bachelor of Science"
              value={educationData.degree}
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
                  !educationData.startDate && "text-muted-foreground"
                )}
                onClick={() => setStartDateCalendarOpen(!startDateCalendarOpen)}
              >
                {educationData.startDate ? (
                  format(new Date(educationData.startDate), "PPP")
                ) : (
                  <span>Start Date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
              {startDateCalendarOpen && (
                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={educationData.startDate ? new Date(educationData.startDate) : undefined}
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
                  !educationData.endDate && "text-muted-foreground"
                )}
                onClick={() => setEndDateCalendarOpen(!endDateCalendarOpen)}
              >
                {educationData.endDate ? (
                  format(new Date(educationData.endDate), "PPP")
                ) : (
                  <span>End Date (or expected)</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
              {endDateCalendarOpen && (
                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-md shadow-md">
                  <Calendar
                    mode="single"
                    selected={educationData.endDate ? new Date(educationData.endDate) : undefined}
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
                !educationData.school || 
                !educationData.degree || 
                !educationData.startDate || 
                !educationData.endDate
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
