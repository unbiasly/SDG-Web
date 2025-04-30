import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Education } from "@/service/api.interface";
import { toast } from "sonner";

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (education: Education, id?: string, isDeleted?: boolean) => void;
  education?: Education;
  id?: string;
}

export const EducationDialog: React.FC<EducationDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  education,
  id,
}) => {
  // Initialize education data with provided education or new default
  const [educationData, setEducationData] = useState<Education>({
    _id: "",
    school: "",
    degree: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  });
  const [startDateCalendarOpen, setStartDateCalendarOpen] = useState<boolean>(false);
  const [endDateCalendarOpen, setEndDateCalendarOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Update local state when education prop changes
  useEffect(() => {
    if (education) {
      setEducationData({
        _id: education._id || id || "",
        school: education.school || "",
        degree: education.degree || "",
        startDate: education.startDate || new Date().toISOString(),
        endDate: education.endDate || new Date().toISOString(),
      });
    } else {
      setEducationData({
        _id: id || crypto.randomUUID(),
        school: "",
        degree: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      });
    }
  }, [education, id, open]);

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
      // Call the parent's onSave function passing the education data
      onSave(educationData, educationData._id);
      onOpenChange(false);
      toast.success("Education saved successfully");
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error("Failed to save education");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      // Call the parent's onSave function with the isDeleted flag
      onSave({} as Education, educationData._id, true);
      onOpenChange(false);
      toast.success("Education deleted successfully");
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error("Failed to delete education");
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
            <DialogTitle className="text-xl font-bold">
              {education?._id ? "Edit education" : "Add education"}
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
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
                type="button"
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
                type="button"
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
          {education?._id && (
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              disabled={isSubmitting}
              type="button"
            >
              Delete
            </Button>
          )}
          <div className={education?._id ? "" : "ml-auto"}>
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
              type="button"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
