"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserData, UserDetailsRequest } from "@/service/api.interface";
import { toast } from "react-hot-toast";
import { DatePicker } from "../ui/date-picker";

// Helper function for URL validation
const isValidURL = (urlString: string): boolean => {
    if (!urlString) return true; // Allow empty string, backend handles if it's required or not
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

export const UserProfileDialog = ({ user, onSuccess }: { user: UserData, onSuccess: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    
    // Store the original user data for comparison
    const [originalData, setOriginalData] = useState<UserDetailsRequest | null>(null);
    
    // Helper function to get initial data from user prop
    const getInitialDataFromUser = () => {
        const today = new Date();
        const thirteenYearsAgo = new Date(
            today.getFullYear() - 13,
            today.getMonth(),
            today.getDate()
        );
        
        return {
            name: user?.fName && user?.lName ? `${user.fName} ${user.lName}` : undefined,
            location: user?.location,
            gender: user?.gender || undefined,
            dob: user?.dob ? new Date(user.dob) : thirteenYearsAgo,
            portfolioLink: user?.portfolioLink || undefined,
            bio: user?.bio || undefined,
            education: user?.education || [],
            experience: user?.experience || [],
            fName: user?.fName || undefined,
            lName: user?.lName || undefined,
            occupation: user?.occupation || undefined,
            pronouns: user?.pronouns || undefined,
            headline: user?.headline || undefined,
            profileImage: user?.profileImage || undefined,
            profileBackgroundImage: user?.profileBackgroundImage || undefined,
        };
    };

    const [profileData, setProfileData] = useState<UserDetailsRequest>(getInitialDataFromUser);

    // Add file state for image uploads
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
    
    // Track if data has been modified
    const [isDataModified, setIsDataModified] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // Reset function to restore original state
    const resetToOriginalState = () => {
        const initialData = getInitialDataFromUser();
        setProfileData(initialData);
        setOriginalData(initialData);
        setProfileImageFile(null);
        setBackgroundImageFile(null);
        setIsDataModified(false);
        setErrors({});
        setCalendarOpen(false);
    };

    // Handle dialog open/close
    const handleDialogChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            // Reset to fresh data when opening
            resetToOriginalState();
        } else {
            // Also reset when closing (in case user cancels)
            resetToOriginalState();
        }
    };

    // Initialize original data when user prop changes or dialog opens
    useEffect(() => {
        if (user && isOpen) {
            const initialData = getInitialDataFromUser();
            setOriginalData(initialData);
            setProfileData(initialData); // Initialize profileData with the same data
        }
    }, [user, isOpen]);

    // Check for modifications whenever profileData, profileImageFile, or backgroundImageFile changes
    useEffect(() => {
        if (!originalData) return;

        const isTextDataChanged =
            originalData.fName !== profileData.fName ||
            originalData.lName !== profileData.lName ||
            originalData.location !== profileData.location ||
            originalData.gender !== profileData.gender ||
            originalData.portfolioLink !== profileData.portfolioLink ||
            originalData.bio !== profileData.bio ||
            originalData.occupation !== profileData.occupation ||
            originalData.pronouns !== profileData.pronouns ||
            originalData.headline !== profileData.headline;

        const isDateChanged =
            originalData.dob?.toDateString() !== profileData.dob?.toDateString();

        const isFileChanged = profileImageFile !== null || backgroundImageFile !== null;

        setIsDataModified(isTextDataChanged || isDateChanged || isFileChanged);
    }, [profileData, profileImageFile, backgroundImageFile, originalData]);

    const validateField = (
        name: string,
        value: string | undefined | Date
    ): string | null => {
        const strValue =
            typeof value === "string"
                ? value
                : value instanceof Date
                ? value.toISOString()
                : "";

        // Get the original value for this field
        const getOriginalValue = (fieldName: string): string => {
            if (!originalData) return "";

            switch (fieldName) {
                case "fName":
                    return originalData.fName || "";
                case "lName":
                    return originalData.lName || "";
                case "occupation":
                    return originalData.occupation || "";
                case "pronouns":
                    return originalData.pronouns || "";
                case "headline":
                    return originalData.headline || "";
                case "location":
                    return originalData.location || "";
                case "bio":
                    return originalData.bio || "";
                case "portfolioLink":
                    return originalData.portfolioLink || "";
                case "gender":
                    return originalData.gender || "";
                default:
                    return "";
            }
        };

        const originalValue = getOriginalValue(name);
        const hasOriginalValue = originalValue.trim() !== "";
        const isCurrentValueEmpty = strValue.trim() === "";

        // Prevent clearing fields that previously had values
        if (hasOriginalValue && isCurrentValueEmpty) {
            return `This field cannot be left empty as it already contains data.`;
        }

        // DOB validation
        if (name === "dob" && value instanceof Date) {
            const today = new Date();
            const minAge = 13;
            const maxAge = 120;
            
            // Check if user is at least 13 years old
            const minAgeDate = new Date(
                today.getFullYear() - minAge,
                today.getMonth(),
                today.getDate()
            );
            
            if (value > minAgeDate) {
                return "You must be at least 13 years old.";
            }
            
            // Check if date is not in future
            if (value > today) {
                return "Date of birth cannot be in the future.";
            }
            
            // Check maximum age limit
            const maxAgeDate = new Date(
                today.getFullYear() - maxAge,
                today.getMonth(),
                today.getDate()
            );
            
            if (value < maxAgeDate) {
                return "Please enter a valid date of birth.";
            }
        }

        // Existing validations
        switch (name) {
            case "fName":
                if (strValue.length > 20)
                    return "First name must not exceed 20 characters.";
                break;
            case "lName":
                if (strValue.length > 20)
                    return "Last name must not exceed 20 characters.";
                break;
            case "occupation":
                if (strValue.length > 20)
                    return "Occupation must not exceed 20 characters.";
                break;
            case "pronouns":
                if (strValue.length > 20)
                    return "Pronouns must not exceed 20 characters.";
                break;
            case "headline":
                if (strValue.length > 20)
                    return "Headline must not exceed 20 characters.";
                break;
            case "location":
                if (strValue.length > 20)
                    return "Location must not exceed 20 characters.";
                break;
            case "bio":
                if (strValue.length > 100)
                    return "Bio must not exceed 100 characters.";
                break;
            case "portfolioLink":
                if (strValue && !isValidURL(strValue))
                    return "Portfolio link must be a valid URL.";
                break;
            case "gender":
                if (
                    strValue &&
                    strValue !== "" &&
                    !["male", "female", "other"].includes(strValue)
                ) {
                    return "Gender must be 'male', 'female', or 'other' if specified. 'Prefer not to say' is not directly supported by current backend rules.";
                }
                break;
            default:
                break;
        }
        return null;
    };

    // Function to determine if a date should be disabled
    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        const minAge = 0;
        const maxAge = 120;

        // Disable future dates
        if (date > today) return true;

        // Disable dates that would make user less than 13 years old
        const minAgeDate = new Date(
            today.getFullYear() - minAge,
            today.getMonth(),
            today.getDate()
        );
        if (date > minAgeDate) return true;

        // Disable dates that would make user more than 120 years old
        const maxAgeDate = new Date(
            today.getFullYear() - maxAge,
            today.getMonth(),
            today.getDate()
        );
        if (date < maxAgeDate) return true;

        return false;
    };

    // Initialize original data when component mounts
    useEffect(() => {
        if (user) {
            const initialData = {
                name:
                    user?.fName && user?.lName
                        ? `${user.fName} ${user.lName}`
                        : undefined,
                location: user.location || undefined,
                gender: user.gender || undefined,
                dob: user.dob ? new Date(user.dob) : undefined,
                portfolioLink: user.portfolioLink || undefined,
                bio: user.bio || undefined,
                education: user.education || [],
                experience: user.experience || [],
                fName: user.fName || undefined,
                lName: user.lName || undefined,
                occupation: user.occupation || undefined,
                pronouns: user.pronouns || undefined,
                headline: user.headline || undefined,
                profileImage: user.profileImage || undefined,
                profileBackgroundImage:
                    user.profileBackgroundImage || undefined,
            };
            setOriginalData(initialData);
            setProfileData(initialData); // Initialize profileData with the same data
        }
    }, [user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setProfileData((prev) => ({ ...prev, dob: date }));
        
        // Validate the date
        if (date) {
            const error = validateField("dob", date);
            setErrors((prev) => ({ ...prev, dob: error }));
        } else {
            setErrors((prev) => ({ ...prev, dob: null }));
        }

        if (date) {
            setCalendarOpen(false);
        }
    };

    const handleSelectChange = (value: string, fieldName: string) => {
        setProfileData((prev) => ({ ...prev, [fieldName]: value }));
        const error = validateField(fieldName, value);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
    };

    // Add file input handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            if (name === "profileImageFile") {
                setProfileImageFile(files[0]);
            } else if (name === "backgroundImageFile") {
                setBackgroundImageFile(files[0]);
            }
        }
    };

    const runAllValidationsAndGetErrors = (): Record<string, string | null> => {
        const newErrors: Record<string, string | null> = {};

        const fieldsToValidate = [
            { name: "fName", value: profileData.fName },
            { name: "lName", value: profileData.lName },
            { name: "occupation", value: profileData.occupation },
            { name: "headline", value: profileData.headline },
            { name: "location", value: profileData.location },
            { name: "bio", value: profileData.bio },
            { name: "portfolioLink", value: profileData.portfolioLink },
            { name: "gender", value: profileData.gender },
            { name: "pronouns", value: profileData.pronouns },
        ];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field.name, field.value);
            newErrors[field.name] = error;
        });

        setErrors(newErrors);
        return newErrors;
    };

    // Move the validation logic inside useMemo to prevent infinite re-renders
    const validationIssues = useMemo(() => {
        const newErrors: Record<string, string | null> = {};

        const fieldsToValidate = [
            { name: "fName", value: profileData.fName },
            { name: "lName", value: profileData.lName },
            { name: "occupation", value: profileData.occupation },
            { name: "headline", value: profileData.headline },
            { name: "location", value: profileData.location },
            { name: "bio", value: profileData.bio },
            { name: "portfolioLink", value: profileData.portfolioLink },
            { name: "gender", value: profileData.gender },
            { name: "pronouns", value: profileData.pronouns },
            { name: "dob", value: profileData.dob },
        ];

        fieldsToValidate.forEach((field) => {
            const error = validateField(field.name, field.value);
            newErrors[field.name] = error;
        });

        return newErrors;
    }, [profileData, originalData]);

    const hasValidationErrors = useMemo(() => {
        return Object.values(validationIssues).some((e) => e !== null);
    }, [validationIssues]);

    // Fix the handleProfileUpdate function to send all fields, including empty strings
    const handleProfileUpdate = async () => {
        // Run validation and update errors state
        const currentErrors = runAllValidationsAndGetErrors();
        const hasErrors = Object.values(currentErrors).some((e) => e !== null);

        if (hasErrors) {
            // Show the first validation error
            const firstError = Object.values(currentErrors).find(
                (e) => e !== null
            );
            if (firstError) {
                toast.error(`Validation Error: ${firstError}`);
            }
            return;
        }

        try {
            const formData = new FormData();

            // Helper function to get the value to send (original if current is empty and original exists)
            const getValueToSend = (
                currentValue: string | undefined,
                fieldName: string
            ): string => {
                if (!originalData) return currentValue || "";

                const originalValue = (() => {
                    switch (fieldName) {
                        case "fName":
                            return originalData.fName || "";
                        case "lName":
                            return originalData.lName || "";
                        case "location":
                            return originalData.location || "";
                        case "portfolioLink":
                            return originalData.portfolioLink || "";
                        case "bio":
                            return originalData.bio || "";
                        case "occupation":
                            return originalData.occupation || "";
                        case "headline":
                            return originalData.headline || "";
                        case "gender":
                            return originalData.gender || "";
                        case "pronouns":
                            return originalData.pronouns || "";
                        default:
                            return "";
                    }
                })();

                // If current value is empty but original had value, keep original
                if (
                    (currentValue || "").trim() === "" &&
                    originalValue.trim() !== ""
                ) {
                    return originalValue;
                }

                return currentValue || "";
            };

            // Append fields with validation-aware values
            formData.append(
                "fName",
                getValueToSend(profileData.fName, "fName")
            );
            formData.append(
                "lName",
                getValueToSend(profileData.lName, "lName")
            );
            formData.append(
                "location",
                getValueToSend(profileData.location, "location")
            );
            formData.append(
                "portfolioLink",
                getValueToSend(profileData.portfolioLink, "portfolioLink")
            );
            formData.append("bio", getValueToSend(profileData.bio, "bio"));
            formData.append(
                "occupation",
                getValueToSend(profileData.occupation, "occupation")
            );
            formData.append(
                "headline",
                getValueToSend(profileData.headline, "headline")
            );
            formData.append(
                "gender",
                getValueToSend(profileData.gender, "gender")
            );
            formData.append(
                "pronouns",
                getValueToSend(profileData.pronouns, "pronouns")
            );

            // Create name field based on first and last name
            const fNameToSend = getValueToSend(profileData.fName, "fName");
            const lNameToSend = getValueToSend(profileData.lName, "lName");
            const fullName =
                fNameToSend && lNameToSend
                    ? `${fNameToSend} ${lNameToSend}`.trim()
                    : "";
            formData.append("name", fullName);

            // Handle date field normally - no special validation
            if (profileData.dob) {
                formData.append("dob", profileData.dob.toISOString());
            } else {
                formData.append("dob", "");
            }

            // Handle file uploads
            if (profileImageFile) {
                formData.append("profileImage", profileImageFile);
            } else if (profileData.profileImage) {
                formData.append(
                    "profileImage",
                    profileData.profileImage.toString()
                );
            } else {
                formData.append("profileImage", "");
            }

            if (backgroundImageFile) {
                formData.append("profileBackgroundImage", backgroundImageFile);
            } else if (profileData.profileBackgroundImage) {
                formData.append(
                    "profileBackgroundImage",
                    profileData.profileBackgroundImage.toString()
                );
            } else {
                formData.append("profileBackgroundImage", "");
            }

            const response = await fetch("/api", {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                // Handle successful update
                console.log("Profile updated successfully");
                toast.success("Profile updated successfully!");
                setIsOpen(false); // Close dialog
                resetToOriginalState(); // Reset state
                onSuccess(); // Call success callback
            } else {
                const errorText = await response.json();
                console.log("Error response:", errorText);
                toast.error(
                    `Failed to update profile: ${
                        errorText.message || errorText.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                `An error occurred while updating your profile. Please try again later.`
            );
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <button className="rounded-full cursor-pointer px-6 py-2 bg-accent hover:bg-accent/80 text-white border-none backdrop-blur-sm transition-all duration-300 font-medium text-sm md:text-base">
                    Edit Profile
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto hidden-scrollbar bg-white">
                <DialogHeader className="border-b border-gray-300 pb-4">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-xl font-bold">
                            Edit Profile
                        </DialogTitle>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        * Indicates required
                    </p>
                </DialogHeader>

                <div className="space-y-6 ">
                    {/* First Name */}
                    <div className="space-y-2">
                        <label htmlFor="fName" className="text-sm font-medium">
                            First Name
                        </label>
                        <Input
                            id="fName"
                            name="fName"
                            placeholder="Your first name"
                            value={profileData.fName || ""}
                            onChange={handleInputChange}
                            className={errors.fName ? "border-red-500" : ""}
                        />
                        {errors.fName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.fName}
                            </p>
                        )}
                    </div>
                    {/* Last Name */}
                    <div className="space-y-2">
                        <label htmlFor="lName" className="text-sm font-medium">
                            Last Name
                        </label>
                        <Input
                            id="lName"
                            name="lName"
                            placeholder="Your last name"
                            value={profileData.lName || ""}
                            onChange={handleInputChange}
                            className={errors.lName ? "border-red-500" : ""}
                        />
                        {errors.lName && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.lName}
                            </p>
                        )}
                    </div>
                    {/* Username */}
                    {/* <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="text-sm font-medium"
                        >
                            Username<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Your username"
                            value={profileData.username || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div> */}
                    {/* Headline */}
                    <div className="space-y-2">
                        <label
                            htmlFor="headline"
                            className="text-sm font-medium"
                        >
                            Headline
                        </label>
                        <Input
                            id="headline"
                            name="headline"
                            placeholder="Your professional headline"
                            value={profileData.headline || ""}
                            onChange={handleInputChange}
                            className={errors.headline ? "border-red-500" : ""}
                        />
                        {errors.headline && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.headline}
                            </p>
                        )}
                    </div>
                    {/* Profile Image */}
                    <div className="space-y-2">
                        <label
                            htmlFor="profileImageFile"
                            className="text-sm font-medium"
                        >
                            Profile Image
                        </label>
                        <Input
                            id="profileImageFile"
                            name="profileImageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {profileData.profileImage && !profileImageFile && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">
                                    Current image:{" "}
                                    {typeof profileData.profileImage ===
                                    "string"
                                        ? profileData.profileImage
                                        : ""}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Background Image */}
                    <div className="space-y-2">
                        <label
                            htmlFor="backgroundImageFile"
                            className="text-sm font-medium"
                        >
                            Profile Background Image
                        </label>
                        <Input
                            id="backgroundImageFile"
                            name="backgroundImageFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {profileData.profileBackgroundImage &&
                            !backgroundImageFile && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500">
                                        Current image:{" "}
                                        {typeof profileData.profileBackgroundImage ===
                                        "string"
                                            ? profileData.profileBackgroundImage
                                            : ""}
                                    </p>
                                </div>
                            )}
                    </div>
                    {/* Name */}
                    {/* <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Your full name"
                            value={profileData.name || ""}
                            onChange={handleInputChange}
                            required
                        />
                    </div> */}
                    {/* Location */}
                    <div className="space-y-2">
                        <label
                            htmlFor="location"
                            className="text-sm font-medium"
                        >
                            Location
                        </label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="City, Country"
                            value={profileData.location || ""}
                            onChange={handleInputChange}
                            className={errors.location ? "border-red-500" : ""}
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.location}
                            </p>
                        )}
                    </div>
                    {/* Gender */}
                    <div className="space-y-2">
                        <label htmlFor="gender" className="text-sm font-medium">
                            Gender
                        </label>
                        <Select
                            value={profileData.gender}
                            onValueChange={(value) =>
                                handleSelectChange(value, "gender")
                            }
                        >
                            <SelectTrigger
                                className={
                                    errors.gender ? "border-red-500" : ""
                                }
                            >
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">
                                    Prefer not to say
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.gender}
                            </p>
                        )}
                    </div>
                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <label htmlFor="dob" className="text-sm font-medium">
                            Date of Birth
                        </label>
                        <DatePicker
                            selected={profileData.dob}
                            onSelect={handleDateChange}
                            placeholder="Select date of birth"
                            disabled={isDateDisabled}
                            className={errors.dob ? "border-red-500" : ""}
                        />
                        {errors.dob && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.dob}
                            </p>
                        )}
                    </div>
                    {/* Pronouns */}
                    <div className="space-y-2">
                        <label
                            htmlFor="pronouns"
                            className="text-sm font-medium"
                        >
                            Pronouns
                        </label>
                        <Select
                            value={profileData.pronouns || ""}
                            onValueChange={(value: string) => {
                                handleSelectChange(value, "pronouns");
                            }}
                        >
                            <SelectTrigger
                                id="pronouns"
                                className={
                                    errors.pronouns ? "border-red-500" : ""
                                }
                            >
                                <SelectValue placeholder="Select pronouns" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="he/him">He/Him</SelectItem>
                                <SelectItem value="she/her">She/Her</SelectItem>
                                <SelectItem value="they/them">
                                    They/Them
                                </SelectItem>
                                <SelectItem value="prefer-not-to-say">
                                    Prefer not to say
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.pronouns && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.pronouns}
                            </p>
                        )}
                    </div>
                    {/* Occupation */}
                    <div className="space-y-2">
                        <label
                            htmlFor="occupation"
                            className="text-sm font-medium"
                        >
                            Occupation
                        </label>
                        <Input
                            id="occupation"
                            name="occupation"
                            placeholder="Your occupation"
                            value={profileData.occupation || ""}
                            onChange={handleInputChange}
                            className={
                                errors.occupation ? "border-red-500" : ""
                            }
                        />
                        {errors.occupation && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.occupation}
                            </p>
                        )}
                    </div>
                    {/* Portfolio Link */}
                    <div className="space-y-2">
                        <label
                            htmlFor="portfolioLink"
                            className="text-sm font-medium"
                        >
                            Portfolio Link
                        </label>
                        <Input
                            id="portfolioLink"
                            name="portfolioLink"
                            placeholder="https://your-portfolio.com"
                            value={profileData.portfolioLink || ""}
                            onChange={handleInputChange}
                            className={
                                errors.portfolioLink ? "border-red-500" : ""
                            }
                        />
                        {errors.portfolioLink && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.portfolioLink}
                            </p>
                        )}
                    </div>
                    {/* Bio */}
                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">
                            Bio
                        </label>
                        <Input
                            id="bio"
                            name="bio"
                            placeholder="Tell us about yourself"
                            value={profileData.bio || ""}
                            onChange={handleInputChange}
                            className={errors.bio ? "border-red-500" : ""}
                        />
                        {errors.bio && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.bio}
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t pt-4 flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProfileUpdate}
                        className="bg-accent hover:bg-accent text-white cursor-pointer px-8"
                        disabled={!isDataModified || hasValidationErrors}
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
