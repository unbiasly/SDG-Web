import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Education } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface EducationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (education: Education, id?: string, isDeleted?: boolean) => void;
    education?: Education;
}

export const EducationDialog: React.FC<EducationDialogProps> = ({
    open,
    onOpenChange,
    onSave,
    education,
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Add original state tracking
    const [originalData, setOriginalData] = useState<Education | null>(null);
    const [originallyStudying, setOriginallyStudying] =
        useState<boolean>(false);

    // Existing state definitions
    const [educationData, setEducationData] = useState<Education>({
        _id: "",
        school: "",
        degree: "",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
    });
    const [startDateCalendarOpen, setStartDateCalendarOpen] =
        useState<boolean>(false);
    const [endDateCalendarOpen, setEndDateCalendarOpen] =
        useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [currentlyStudying, setCurrentlyStudying] = useState<boolean>(false);
    const [dateError, setDateError] = useState<string>("");

    const { user } = useUser();

    // Update local state when education prop changes and store original values
    useEffect(() => {
        if (open) {
            if (education) {
                const isCurrentEducation =
                    education.endDate === "present" ||
                    education.endDate === "Present" ||
                    education.endDate === null;

                const newData = {
                    _id: education._id || "",
                    school: education.school || "",
                    degree: education.degree || "",
                    startDate: education.startDate || new Date().toISOString(),
                    endDate: isCurrentEducation
                        ? new Date().toISOString()
                        : education.endDate || new Date().toISOString(),
                };

                setEducationData(newData);
                setOriginalData(newData); // Store original data
                setCurrentlyStudying(isCurrentEducation);
                setOriginallyStudying(isCurrentEducation); // Store original studying status
            } else {
                const defaultData = {
                    _id: "",
                    school: "",
                    degree: "",
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                };
                setEducationData(defaultData);
                setOriginalData(defaultData);
                setCurrentlyStudying(false);
                setOriginallyStudying(false);
            }
            setDateError("");
        }
    }, [education, open]);

    // Function to check if there are any changes
    const hasChanges = () => {
        if (!originalData) return false;

        // Compare studying status
        if (currentlyStudying !== originallyStudying) return true;

        // For new entries, any data is a change
        if (!education?._id && (educationData.school || educationData.degree))
            return true;

        // Compare basic fields
        if (educationData.school !== originalData.school) return true;
        if (educationData.degree !== originalData.degree) return true;

        // Compare dates (handling ISO strings)
        const startDateEqual =
            new Date(educationData.startDate).getTime() ===
            new Date(originalData.startDate).getTime();
        if (!startDateEqual) return true;

        // Only compare end dates if not currently studying
        if (!currentlyStudying && originalData.endDate) {
            const endDateEqual =
                educationData.endDate && originalData.endDate
                    ? new Date(educationData.endDate).getTime() ===
                      new Date(originalData.endDate).getTime()
                    : educationData.endDate === originalData.endDate;
            if (!endDateEqual) return true;
        }

        return false;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEducationData((prev) => ({ ...prev, [name]: value }));

        // Clear validation errors when user starts typing
        if ((name === "school" && !value) || (name === "degree" && !value)) {
            toast.dismiss(); // Dismiss any existing toast messages related to required fields
        }
    };

    const handleDateChange = (
        field: "startDate" | "endDate",
        date: Date | undefined
    ) => {
        if (date) {
            // Update state first
            setEducationData((prev) => {
                const updated = { ...prev, [field]: date.toISOString() };

                // Validate with the updated values
                if (
                    !currentlyStudying &&
                    updated.startDate &&
                    updated.endDate
                ) {
                    const startDate = new Date(updated.startDate);
                    const endDate = new Date(updated.endDate);

                    if (!isBefore(startDate, endDate)) {
                        setDateError("Start date must be before end date");
                    } else {
                        setDateError("");
                    }
                }

                return updated;
            });
        }

        if (field === "startDate") setStartDateCalendarOpen(false);
        if (field === "endDate") setEndDateCalendarOpen(false);
    };

    const handleCurrentlyStudyingChange = (checked: boolean) => {
        setCurrentlyStudying(checked);
        if (checked) {
            // Clear any date validation errors
            setDateError("");
            // Also dismiss any toast errors related to end date
            toast.dismiss();
        }
    };

    /**
     * Updates the user's education array on the server
     */
    const updateUserWithEducation = async (isDeleteOperation: boolean) => {
        if (!user) {
            toast.error("User data not available.");
            throw new Error("User data not available.");
        }

        let updatedEducations = [...(user.education || [])];
        const currentEntryId = education?._id;

        if (isDeleteOperation) {
            if (!currentEntryId) {
                toast.error("Cannot delete an item without an ID.");
                throw new Error("Cannot delete an item without an ID.");
            }
            // Filter out the education item to be deleted
            updatedEducations = updatedEducations.filter(
                (edu) => edu._id !== currentEntryId
            );
        } else {
            // Prepare education data with "present" for currently studying
            const preparedEducationData = {
                ...educationData,
                endDate: currentlyStudying ? "present" : educationData.endDate,
            };

            // This is an Add or Edit operation
            if (currentEntryId) {
                // Editing an existing education
                const indexToUpdate = updatedEducations.findIndex(
                    (edu) => edu._id === currentEntryId
                );
                if (indexToUpdate !== -1) {
                    updatedEducations[indexToUpdate] = {
                        ...preparedEducationData,
                        _id: currentEntryId,
                    };
                } else {
                    toast.error("Education not found in user profile.");
                    throw new Error("Education not found in user profile.");
                }
            } else {
                // Adding a new education - strip out the empty ID field
                const { _id, ...educationWithoutId } = preparedEducationData; // Remove _id from the data
                updatedEducations.push(educationWithoutId);
            }
        }

        // Send the updated education array to the server
        const response = await fetch("/api", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ education: updatedEducations }),
        });

        if (!response.ok) {
            const errorData = await response
                .json()
                .catch(() => ({ message: "Unknown server error" }));
            throw new Error(
                errorData.message ||
                    `Failed to update user details (status: ${response.status})`
            );
        }

        return await response.json();
    };

    // Optional: Add more comprehensive date validation
    const validateDates = () => {
        if (
            !currentlyStudying &&
            educationData.startDate &&
            educationData.endDate
        ) {
            const startDate = new Date(educationData.startDate);
            const endDate = new Date(educationData.endDate);

            if (!isBefore(startDate, endDate)) {
                setDateError("Start date must be before end date");
                return false;
            }
        }
        setDateError("");
        return true;
    };

    const handleSave = async () => {
        // Basic validation
        if (
            !educationData.school ||
            !educationData.degree ||
            !educationData.startDate
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // End date validation (only if not currently studying)
        if (!currentlyStudying && !educationData.endDate) {
            toast.error(
                "Please provide an end date or select 'I am currently studying here'."
            );
            return;
        }

        // Use the validation function
        if (!validateDates()) {
            toast.error("Start date must be before end date.");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedUserData = await updateUserWithEducation(false);

            // Use the custom event to notify the parent component
            window.dispatchEvent(
                new CustomEvent("user-profile-updated", {
                    detail: updatedUserData.data || updatedUserData,
                })
            );

            // Prepare the education data with proper "present" handling for the callback
            const resultEducationData = {
                ...educationData,
                endDate: currentlyStudying ? "present" : educationData.endDate,
            };

            // Call onSave to maintain component's expected behavior
            if (education?._id) {
                onSave(resultEducationData, education._id, false);
            } else {
                // Try to find the newly added education in the response
                const newEducation = (
                    updatedUserData.data?.education || updatedUserData.education
                )?.find(
                    (edu: Education) =>
                        edu.school === educationData.school &&
                        edu.degree === educationData.degree &&
                        (!education || education._id !== edu._id)
                );
                onSave(resultEducationData, newEducation?._id || "", false);
            }

            onOpenChange(false);
            toast.success("Education saved successfully!");
        } catch (error) {
            console.error("Error saving education:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save education"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!education?._id) {
            toast.error("No education selected to delete.");
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedUserData = await updateUserWithEducation(true);

            // Use the custom event to notify the parent component
            window.dispatchEvent(
                new CustomEvent("user-profile-updated", {
                    detail: updatedUserData.data || updatedUserData,
                })
            );

            // Call onSave to maintain component's expected behavior
            onSave(educationData, education._id, true);

            onOpenChange(false);
            toast.success("Education deleted successfully!");
        } catch (error) {
            console.error("Error deleting education:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete education"
            );
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
                        className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
                                !educationData.startDate &&
                                    "text-muted-foreground dark:text-gray-400"
                            )}
                            onClick={() =>
                                setStartDateCalendarOpen(!startDateCalendarOpen)
                            }
                        >
                            {educationData.startDate ? (
                                format(new Date(educationData.startDate), "PPP")
                            ) : (
                                <span>Start Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                        {startDateCalendarOpen && (
                            <div className="absolute z-50 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                                <Calendar
                                    mode="single"
                                    selected={
                                        educationData.startDate
                                            ? new Date(educationData.startDate)
                                            : undefined
                                    }
                                    onSelect={(date) =>
                                        handleDateChange("startDate", date)
                                    }
                                    initialFocus
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Currently studying checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="currentlyStudying"
                        checked={currentlyStudying}
                        onCheckedChange={handleCurrentlyStudyingChange}
                    />
                    <label
                        htmlFor="currentlyStudying"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I am currently studying here
                    </label>
                </div>

                {/* End Date - conditionally shown when not currently studying */}
                {!currentlyStudying && (
                    <div className="space-y-2">
                        <label
                            htmlFor="endDate"
                            className="text-sm font-medium"
                        >
                            End Date<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
                                    !educationData.endDate &&
                                        "text-muted-foreground dark:text-gray-400",
                                    dateError && "border-red-500" // Highlight the button when there's an error
                                )}
                                onClick={() =>
                                    setEndDateCalendarOpen(!endDateCalendarOpen)
                                }
                            >
                                {educationData.endDate ? (
                                    format(
                                        new Date(educationData.endDate),
                                        "PPP"
                                    )
                                ) : (
                                    <span>End Date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                            {endDateCalendarOpen && (
                                <div className="absolute z-50 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border dark:border-gray-600">
                                    <Calendar
                                        mode="single"
                                        selected={
                                            educationData.endDate
                                                ? new Date(
                                                      educationData.endDate
                                                  )
                                                : undefined
                                        }
                                        onSelect={(date) =>
                                            handleDateChange("endDate", date)
                                        }
                                        initialFocus
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Move error message outside the conditional section so it's visible regardless */}
                {dateError && (
                    <p className="text-red-500 text-sm">{dateError}</p>
                )}
            </div>
        </>
    );

    // Footer content component to be shared between Dialog and Drawer
    const FooterContent = () => (
        <>
            {education?._id && (
                <Button
                    type="button"
                    onClick={handleDelete}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900 dark:hover:text-red-300 w-full sm:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                </Button>
            )}
            <div
                className={cn(
                    "flex gap-2 w-full",
                    education?._id ? "" : "justify-end"
                )}
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                    className="dark:border-gray-600 w-1/2 sm:w-auto dark:hover:bg-gray-700"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={handleSave}
                    className="bg-accent w-1/2 sm:w-auto hover:bg-accent/70 text-white"
                    disabled={
                        isSubmitting ||
                        !educationData.school ||
                        !educationData.degree ||
                        !educationData.startDate ||
                        (!currentlyStudying && !educationData.endDate) ||
                        !!dateError ||
                        !hasChanges() // Disable if no changes detected
                    }
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Save"
                    )}
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
                            {education?._id
                                ? "Edit Education"
                                : "Add Education"}
                        </DrawerTitle>
                        <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                            * Indicates required
                        </p>
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
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!isSubmitting) onOpenChange(val);
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 text-black dark:text-white">
                <DialogHeader className="border-b pb-4 dark:border-gray-700">
                    <DialogTitle className="text-xl font-bold">
                        {education?._id ? "Edit Education" : "Add Education"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                        * Indicates required
                    </p>
                </DialogHeader>
                <FormContent />
                <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 dark:border-gray-700">
                    <FooterContent />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
