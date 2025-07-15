"use client";
import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useAppSelector } from "@/lib/redux/hooks";

interface ProfileAvatarProps {
    src: string | File;
    alt?: string;
    size?: "xs" | "sm" | "md" | "profile" | "lg" | "xl";
    editable?: boolean;
    className?: string;
    onClick?: () => void;
    userName?: string;
    borderColor?: string;
    roundedBorder?: string;
}

interface UserFallbackProps {
    size: "xs" | "sm" | "md" | "profile" | "lg" | "xl";
    userName?: string;
    roundedBorder?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    src,
    alt = "Profile",
    size = "sm",
    editable = false,
    onClick,
    className,
    userName,
    borderColor = "gray-200",
    roundedBorder = "rounded-full",
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const sizeClasses = {
        xs: "w-11 h-11",
        sm: "w-16 h-16",
        profile: "w-20 h-20",
        md: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-40 h-40",
    };

    return (
        <div className={`aspect-square ${sizeClasses[size]} ${className}`}>
            <div
                className={`relative w-full h-full overflow-hidden ${roundedBorder} bg-gray-100 border-${size === 'lg' || size === 'xl' ? '4' : '2'} border-${borderColor} ${size ==='lg' || size === 'xl' ?  'shadow-xl' : 'shadow-lg'}`}
            >
                {src ? (
                    <Image
                        src={typeof src === "string" ? src : ""}
                        alt={alt}
                        layout="fill"
                        className={`object-cover transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        } image-lazy-load`}
                        onLoad={() => setImageLoaded(true)}
                        onClick={onClick}
                        priority
                    />
                ) : (
                    <UserFallback size={size} userName={userName} roundedBorder={roundedBorder} />
                )}

                {editable && (
                    <div className="absolute right-0 bottom-0 bg-white rounded-full p-2 shadow-md cursor-pointer transition-transform duration-200 hover:scale-105">
                        <Camera size={18} className="text-gray-700" />
                    </div>
                )}
            </div>
        </div>
    );
};

const UserFallback: React.FC<UserFallbackProps> = ({
    size = "sm",
    userName,
    roundedBorder = "rounded-full",
}) => {
    const fallbackColor = useAppSelector((state) => state.user.fallbackColor);

    const sizeClasses = {
        xs: "text-xl",
        sm: "text-3xl",
        profile: "text-5xl",
        md: "text-5xl",
        lg: "text-6xl",
        xl: "text-7xl",
    };

    return (
        <div
            className={`w-full h-full flex items-center justify-center ${roundedBorder}`}
            style={{ backgroundColor: fallbackColor }}
        >
            <span className={`${sizeClasses[size]} font-bold text-white`}>
                {userName?.charAt(0).toUpperCase() || "?"}
            </span>
        </div>
    );
};

export default ProfileAvatar;
