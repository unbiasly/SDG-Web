import React, { useState } from "react";
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
  const [profileData, setProfileData] = useState<UserDetailsRequest>({
    name: user?.name || "",
    // username: user?.username || "",
    location: user?.location || "",
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob) : new Date(), // Default to current date if undefined
    portfolioLink: user?.portfolioLink || "",
    bio: user?.bio || "",
    education: user?.education || [],
    experience: user?.experience || [],
    fName: user?.fName || "",
    lName: user?.lName || "",
    occupation: user?.occupation || "",
    pronouns: user?.pronouns || "",
    headline: user?.headline || "",
    profileImage: user?.profileImage || "", // Added missing property
    profileBackgroundImage: user?.profileBackgroundImage || "" // Added missing property
  });
  
  // Add file state for image uploads
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setProfileData((prev) => ({ ...prev, dob: date }));
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

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      // Append all necessary fields to FormData
      formData.append('name', `${profileData.fName} ${profileData.lName}`.trim());
    //   formData.append('username', profileData.username);
      formData.append('location', profileData.location || '');
      formData.append('gender', profileData.gender || '');
      formData.append('dob', profileData.dob ? profileData.dob.toISOString() : ''); // Convert date to string
      formData.append('portfolioLink', profileData.portfolioLink || '');
      formData.append('bio', profileData.bio || ''); // Add bio field
      formData.append('fName', profileData.fName || ''); // Add first name field
      formData.append('lName', profileData.lName || ''); // Add last name field
      formData.append('occupation', profileData.occupation || ''); // Add occupation field
      formData.append('pronouns', profileData.pronouns || ''); // Add pronouns field
      formData.append('headline', profileData.headline || ''); // Add headline field
      
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

      const response = await fetch('/profile/userDetailsUpdate', {
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
        <DialogTrigger className="rounded-full cursor-pointer px-6 py-2 bg-accent hover:bg-accent/80 text-white border-none backdrop-blur-sm transition-all duration-300 font-medium">
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
                    selected={profileData.dob ? new Date(profileData.dob) : undefined}
                    onSelect={(date) => {
                      handleDateChange(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date > new Date()}
                    className="p-3 pointer-events-auto"
                  />
                </div>
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
            className="bg-gray-200 hover:bg-gray-100 text-black cursor-pointer px-8"
            disabled={ !profileData.username }
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


