"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserDetailsRequest } from "@/service/api.interface";
import { useUser } from "@/lib/redux/features/user/hooks";
import { toast } from "react-hot-toast";

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

export const UserProfileDialog = ({}) => {
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
    const { user } = useUser();
    // Store the original user data for comparison
    const [originalData, setOriginalData] = useState<UserDetailsRequest | null>(
        null
    );
    const [profileData, setProfileData] = useState<UserDetailsRequest>({
        name:
            user?.fName && user?.lName
                ? `${user.fName} ${user.lName}`
                : undefined,
        location: user?.location,
        gender: user?.gender || undefined,
        dob: user?.dob ? new Date(user.dob) : undefined,
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
    });

    // Add file state for image uploads
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
        null
    );
    // Track if data has been modified
    const [isDataModified, setIsDataModified] = useState(false);
    // const [dobError, setDobError] = useState<string | null>(null); // Removed, integrated into errors
    const [errors, setErrors] = useState<Record<string, string | null>>({});

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
        }
    }, [user]);

    // Check for modifications whenever profileData, profileImageFile, or backgroundImageFile changes
    useEffect(() => {
        if (!originalData) return;

        // Compare fields between current form data and original data
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

        // Compare dates (accounting for potential timezone differences)
        const isDateChanged =
            originalData.dob?.toDateString() !==
            profileData.dob?.toDateString();

        // Check if any file was selected
        const isFileChanged =
            profileImageFile !== null || backgroundImageFile !== null;

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

    // Fix the handleProfileUpdate function to send all fields, including empty strings
    const handleProfileUpdate = async () => {
        const validationIssues = runAllValidationsAndGetErrors();
        const hasValidationErrors = Object.values(validationIssues).some(
            (e) => e !== null
        );

        if (hasValidationErrors) {
            // Show the first validation error
            const firstError = Object.values(validationIssues).find((e) => e !== null);
            if (firstError) {
                toast.error(`Validation Error: ${firstError}`);
            }
            return;
        }

        try {
            const formData = new FormData();

            // Helper function to get the value to send (original if current is empty and original exists)
            const getValueToSend = (currentValue: string | undefined, fieldName: string): string => {
                if (!originalData) return currentValue || "";
                
                const originalValue = (() => {
                    switch (fieldName) {
                        case "fName": return originalData.fName || "";
                        case "lName": return originalData.lName || "";
                        case "location": return originalData.location || "";
                        case "portfolioLink": return originalData.portfolioLink || "";
                        case "bio": return originalData.bio || "";
                        case "occupation": return originalData.occupation || "";
                        case "headline": return originalData.headline || "";
                        case "gender": return originalData.gender || "";
                        case "pronouns": return originalData.pronouns || "";
                        default: return "";
                    }
                })();

                // If current value is empty but original had value, keep original
                if ((currentValue || "").trim() === "" && originalValue.trim() !== "") {
                    return originalValue;
                }
                
                return currentValue || "";
            };

            // Append fields with validation-aware values
            formData.append("fName", getValueToSend(profileData.fName, "fName"));
            formData.append("lName", getValueToSend(profileData.lName, "lName"));
            formData.append("location", getValueToSend(profileData.location, "location"));
            formData.append("portfolioLink", getValueToSend(profileData.portfolioLink, "portfolioLink"));
            formData.append("bio", getValueToSend(profileData.bio, "bio"));
            formData.append("occupation", getValueToSend(profileData.occupation, "occupation"));
            formData.append("headline", getValueToSend(profileData.headline, "headline"));
            formData.append("gender", getValueToSend(profileData.gender, "gender"));
            formData.append("pronouns", getValueToSend(profileData.pronouns, "pronouns"));

            // Create name field based on first and last name
            const fNameToSend = getValueToSend(profileData.fName, "fName");
            const lNameToSend = getValueToSend(profileData.lName, "lName");
            const fullName = fNameToSend && lNameToSend 
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
                formData.append("profileImage", profileData.profileImage.toString());
            } else {
                formData.append("profileImage", "");
            }

            if (backgroundImageFile) {
                formData.append("profileBackgroundImage", backgroundImageFile);
            } else if (profileData.profileBackgroundImage) {
                formData.append("profileBackgroundImage", profileData.profileBackgroundImage.toString());
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
                // Refresh the page to show updated profile
                window.location.reload();
            } else {
                const errorText = await response.json();
                console.log("Error response:", errorText);
                toast.error(
                    `Failed to update profile: ${errorText.message || errorText.error || "Unknown error"}`
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
        <Dialog>
            <DialogTrigger className="rounded-full cursor-pointer px-6 py-2 bg-accent hover:bg-accent/80 text-white border-none backdrop-blur-sm transition-all duration-300 font-medium text-sm md:text-base">
                Edit Profile
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
            <label htmlFor="username" className="text-sm font-medium">
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

                    {/* //!Name
          <div className="space-y-2">
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
                        <div className="relative">
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !profileData.dob && "text-muted-foreground"
                                )}
                                onClick={() => setCalendarOpen(!calendarOpen)}
                            >
                                {profileData.dob ? (
                                    format(profileData.dob, "PPP")
                                ) : (
                                    <span>Select date of birth</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                            {calendarOpen && (
                                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-2xl shadow-md">
                                    <Calendar
                                        mode="single"
                                        selected={profileData.dob && new Date(profileData.dob)}
                                        onSelect={handleDateChange}
                                        disabled={(date) => {
                                            if (date > new Date()) return true;
                                            const minAge = 13;
                                            const today = new Date();
                                            const minAgeDate = new Date(
                                                today.getFullYear() - minAge,
                                                today.getMonth(),
                                                today.getDate()
                                            );
                                            if (date > minAgeDate) return true;
                                            const maxAge = 120;
                                            const maxAgeDate = new Date(
                                                today.getFullYear() - maxAge,
                                                today.getMonth(),
                                                today.getDate()
                                            );
                                            if (date < maxAgeDate) return true;
                                            return false;
                                        }}
                                        className="p-3 pointer-events-auto"
                                    />
                                </div>
                            )}
                        </div>
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

                <div className="border-t pt-4 flex justify-end">
                    <Button
                        onClick={handleProfileUpdate}
                        className="bg-accent hover:bg-accent text-white cursor-pointer px-8"
                        disabled={!isDataModified} // Or: !isDataModified || Object.values(errors).some(e => e !== null)
                    >
                        Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
