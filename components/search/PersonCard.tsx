import Link from "next/link";
import React from "react";
import ProfileAvatar from "../profile/ProfileAvatar";

export interface User {
    _id: string;
    profileImage?: string;
    username: string;
    name?: string;
    occupation?: string;
    email?: string;
    following?: boolean;
}

interface PersonCardProps {
    user: User;
    handleFollowToggle?: (user: User) => void;
    followMutation?: {
        isPending: boolean;
        variables?: {
            targetUserId: string;
        };
    };
}

const PersonCard = ({
    user,
    handleFollowToggle,
    followMutation,
}: PersonCardProps) => {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <Link
                href={`/profile/${user._id}`}
                className="flex items-center flex-1"
            >
                <ProfileAvatar
                    src={user?.profileImage || ""}
                    userName={user.name || user.username}
                    size="xs"
                    className="mr-4"
                    borderColor="gray-400"
                />
                <div>
                    <h3 className="font-bold">{user.name || user.username}</h3>
                    <p className="text-gray-600">
                        {user.occupation || user.email}
                    </p>
                </div>
            </Link>
            {/* <button
        onClick={() => handleFollowToggle(user)}
        className={`font-medium py-2 px-6 rounded-full transition-colors ${
          user.following 
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-blue-700 text-white hover:bg-blue-800'
        }`}
        disabled={followMutation.isPending}
      >
        {followMutation.isPending && followMutation.variables?.targetUserId === user._id
          ? 'Loading...'
          : user.following ? 'Following' : 'Follow'}
      </button> */}
        </div>
    );
};

export default PersonCard;
