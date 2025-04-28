'use client'
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

export const UserProfileDialog = ({
}) => {
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const { user } = useUser();
  // Store the original user data for comparison
  const [originalData, setOriginalData] = useState<UserDetailsRequest | null>(null);
  const [profileData, setProfileData] = useState<UserDetailsRequest>({
    name: user?.fName && user?.lName ? `${user.fName} ${user.lName}` : undefined,
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
    profileBackgroundImage: user?.profileBackgroundImage || undefined
  });
  
  // Add file state for image uploads
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  // Track if data has been modified
  const [isDataModified, setIsDataModified] = useState(false);
  const [dobError, setDobError] = useState<string | null>(null);

  // Initialize original data when component mounts
  useEffect(() => {
    if (user) {
      const initialData = {
        name: user?.fName && user?.lName ? `${user.fName} ${user.lName}` : undefined,
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
        profileBackgroundImage: user.profileBackgroundImage || undefined
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
    const isDateChanged = originalData.dob?.toDateString() !== profileData.dob?.toDateString();
    
    // Check if any file was selected
    const isFileChanged = profileImageFile !== null || backgroundImageFile !== null;
    
    setIsDataModified(isTextDataChanged || isDateChanged || isFileChanged);
  }, [profileData, profileImageFile, backgroundImageFile, originalData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setProfileData((prev) => ({ ...prev, dob: date }));
      setDobError(null); // Clear error when date is manually selected
    }
  };

  const handleSelectChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, gender: value }));
  };

  // Add file input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'profileImageFile') {
        setProfileImageFile(files[0]);
      } else if (name === 'backgroundImageFile') {
        setBackgroundImageFile(files[0]);
      }
    }
  };

  // Fix the handleProfileUpdate function to only send non-empty values
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      
      // Only append fields that have actual values - don't send empty strings
      if (profileData.fName && profileData.fName.trim()) formData.append('fName', profileData.fName);
      if (profileData.lName && profileData.lName.trim()) formData.append('lName', profileData.lName);
      
      // Only create name if both first and last name exist
      if (profileData.fName && profileData.lName) {
        formData.append('name', `${profileData.fName} ${profileData.lName}`.trim());
      }
      
      // Only append fields with actual values
      if (profileData.location && profileData.location.trim()) formData.append('location', profileData.location);
      if (profileData.gender) formData.append('gender', profileData.gender);
      if (profileData.dob) formData.append('dob', profileData.dob.toISOString());
      if (profileData.portfolioLink && profileData.portfolioLink.trim()) formData.append('portfolioLink', profileData.portfolioLink);
      if (profileData.bio && profileData.bio.trim()) formData.append('bio', profileData.bio);
      if (profileData.occupation && profileData.occupation.trim()) formData.append('occupation', profileData.occupation);
      if (profileData.pronouns) formData.append('pronouns', profileData.pronouns);
      if (profileData.headline && profileData.headline.trim()) formData.append('headline', profileData.headline);
      
      // Handle file uploads properly
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      } else if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage.toString());
      }
      
      if (backgroundImageFile) {
        formData.append('profileBackgroundImage', backgroundImageFile);
      } else if (profileData.profileBackgroundImage) {
        formData.append('profileBackgroundImage', profileData.profileBackgroundImage.toString());
      }

      const response = await fetch('/api', {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        // Handle successful update
        console.log('Profile updated successfully');
        // Refresh the page to show updated profile
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error appropriately
    }
  }

  return (
    <Dialog>
        <DialogTrigger className="rounded-full cursor-pointer px-6 py-2 bg-accent hover:bg-accent/80 text-white border-none backdrop-blur-sm transition-all duration-300 font-medium text-sm md:text-base">
            Edit Profile
        </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b border-gray-300 pb-4">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">* Indicates required</p>
        </DialogHeader>

        <div className="space-y-6">

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
            />
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
            />
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
            <label htmlFor="headline" className="text-sm font-medium">
              Headline
            </label>
            <Input
              id="headline"
              name="headline"
              placeholder="Your professional headline"
              value={profileData.headline || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <label htmlFor="profileImageFile" className="text-sm font-medium">
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
                <p className="text-xs text-gray-500">Current image: {typeof profileData.profileImage === 'string' ? profileData.profileImage : ''}</p>
              </div>
            )}
          </div>

          {/* Background Image */}
          <div className="space-y-2">
            <label htmlFor="backgroundImageFile" className="text-sm font-medium">
              Profile Background Image
            </label>
            <Input
              id="backgroundImageFile"
              name="backgroundImageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profileData.profileBackgroundImage && !backgroundImageFile && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">Current image: {typeof profileData.profileBackgroundImage === 'string' ? profileData.profileBackgroundImage : ''}</p>
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
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              placeholder="City, Country"
              value={profileData.location || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Gender
            </label>
            <Select
              value={profileData.gender}
              onValueChange={handleSelectChange}
              
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
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
        !profileData.dob && "text-muted-foreground",
        dobError && "border-red-500"
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
          onSelect={(date) => {
            handleDateChange(date);
            setCalendarOpen(false);
          }}
          disabled={(date) => {
            // Disable future dates
            if (date > new Date()) return true;
            
            // Disable dates for users under minimum age (13)
            const minAge = 13;
            const today = new Date();
            const minAgeDate = new Date(
              today.getFullYear() - minAge,
              today.getMonth(),
              today.getDate()
            );
            if (date > minAgeDate) return true;
            
            // Disable unreasonably old dates
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
    {dobError && (
      <p className="text-red-500 text-xs mt-1">{dobError}</p>
    )}
  </div>
</div>
            {/* Pronouns */}
            <div className="space-y-2">
            <label htmlFor="pronouns" className="text-sm font-medium">
              Pronouns
            </label>
            <Select
              value={profileData.pronouns || ""}
              onValueChange={(value: string) => {
                setProfileData((prev) => ({ ...prev, pronouns: value }));
              }}
            >
              <SelectTrigger id="pronouns">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">He/Him</SelectItem>
                <SelectItem value="she/her">She/Her</SelectItem>
                <SelectItem value="they/them">They/Them</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Occupation */}
          <div className="space-y-2">
            <label htmlFor="occupation" className="text-sm font-medium">
              Occupation
            </label>
            <Input
              id="occupation"
              name="occupation"
              placeholder="Your occupation"
              value={profileData.occupation || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Portfolio Link */}
          <div className="space-y-2">
            <label htmlFor="portfolioLink" className="text-sm font-medium">
              Portfolio Link
            </label>
            <Input
              id="portfolioLink"
              name="portfolioLink"
              placeholder="https://your-portfolio.com"
              value={profileData.portfolioLink || ""}
              onChange={handleInputChange}
            />
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
            />
          </div>

          

        </div>

        <div className="border-t pt-4 flex justify-end">
          <Button 
            onClick={handleProfileUpdate} 
            className="bg-accent hover:bg-accent text-white cursor-pointer px-8"
            disabled={!isDataModified}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


