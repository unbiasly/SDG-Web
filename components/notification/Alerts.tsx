'use client'
import { Notification } from "@/service/api.interface";
import { ChevronRight, MessageSquare, Video, UserPlus, BriefcaseBusiness, FileCheck, FileText, FileEdit, Bell } from "lucide-react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { useCallback } from "react";

const Alerts = ({ _id, post, category, type, message, isRead, userProfile }: Notification) => {
    // Determine the alert style based on type
    let alertStyle = "";
    let Icon = Bell; // Default icon
    let iconStyle = "";
    
    switch (message) {
        case "post":
        case "like":
        case "comment":
        case "repost":
            alertStyle = !isRead ? "bg-blue-50 border-blue-500" : "bg-white";
            Icon = MessageSquare;
            iconStyle = "bg-blue-200";
            break;
        // case "videos":
        //     alertStyle = !isRead ? "bg-pink-50 border-pink-500" : "bg-white";
        //     Icon = Video;
        //     iconStyle = "bg-[#19484A]";
        //     break;
        case "follow":
            alertStyle = !isRead ? "bg-purple-50 border-purple-500" : "bg-white";
            Icon = UserPlus;
            iconStyle = "bg-[#19484A]";
            break;
        default:
            alertStyle = !isRead ? "bg-gray-50 border-gray-400" : "bg-white";
            iconStyle = "bg-[#19484A]";
    }
// 'share', 'sdg-news', 'sdg-video'
    const navigateTo = useCallback(() => {
        if (type === "post" || type === "like" || type === "comment" || type === "repost") {
            window.location.href = `/post/${post}`;
        } else if(type === "follow") {
            window.location.href = `/profile/${post}`;
        } else {
            window.location.reload();
        }
    }, [type, post]);
    
    const handleRead = useCallback(async (notificationId: string) => {
        try {
            const response = await fetch(`/api/notifications`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notificationId
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText}`);
            }
            
            const responseData = await response.json();
            
            if (responseData.success) {
                navigateTo();
            } else {
                throw new Error("Failed to update notification");
            }
        }
        catch (err) {
            console.error("Error marking notification as read:", err);
        }
    }, [navigateTo]);

    const handleClick = useCallback(() => {
        if (!isRead) {
            handleRead(_id);
        } else {
            navigateTo();
        }
    }, [isRead, _id, handleRead, navigateTo]);

    return (
        <div 
            className={`flex shadow-sm items-center p-4 mb-2 relative cursor-pointer transition-all animate-slide-up ${alertStyle} ${!isRead ? 'hover:brightness-95' : ''}`}
            onClick={handleClick}
        >
            <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconStyle} shadow-xs p-5`}>
                    <ProfileAvatar src={userProfile || ''} size='xs' userName={message}/>
                </div>
            </div>
            <div className="ml-4 flex-grow pr-4 overflow-hidden">
                <div className="text-sm font-medium text-accent mb-1">
                    {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                </div>
                <div className="text-xs font-medium text-black truncate">{message}</div>
            </div>
            <div className="text-gray-400 flex-shrink-0">
                {!isRead && <ChevronRight size={20} />}
            </div>
        </div>
    );
};

export default Alerts;
