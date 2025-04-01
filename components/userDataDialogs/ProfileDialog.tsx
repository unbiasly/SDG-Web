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
    const { user } = useUser()
  const [profileData, setProfileData] = useState<UserDetailsRequest>(
    user ? {
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      location: user.location || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob) : undefined,
      portfolioLink: user.portfolioLink || "",
      bio: user.bio || "",
      education: user.education || [],
      experience: user.experience || []
    } : {
      name: "",
      username: "",
      email: "",
      location: "",
      gender: "",
      dob: undefined,
      portfolioLink: "",
      bio: "",
      education: [],
      experience: []
    }
  );

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

  
  const handleProfileUpdate = async () => {
    try {
        const response = await fetch('/profile/userDetailsUpdate', {
            method: "PUT",
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            // Handle successful update
            console.log('Profile updated successfully');
        } else {
            throw new Error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        // Handle error appropriately
    }
  }

  return (
    <Dialog>
        <DialogTrigger className="rounded-full cursor-pointer px-6 py-2 bg-gray-400/70 hover:bg-gray-300/90 text-gray-700 border-none backdrop-blur-sm transition-all duration-300 font-medium">
            Edit Profile
        </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-center w-full">
            <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">* Indicates required</p>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Name */}
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
          </div>

          {/* Username */}
          <div className="space-y-2">
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
          </div>

          {/* Email
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={profileData.email || ""}
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
                <div className="absolute z-50 right-1 bottom-1 mb-1 bg-white rounded-md shadow-md">
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

        
        </div>

        <div className="border-t pt-4 flex justify-end">
          <Button 
            onClick={handleProfileUpdate} 
            className="bg-gray-200 hover:bg-gray-100 text-black cursor-pointer px-8"
            disabled={!profileData.name || !profileData.username || !profileData.email}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
