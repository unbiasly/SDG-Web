import React, { useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { MoreVertical, Smile } from "lucide-react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentData } from "@/service/api.interface";

interface CommentSectionProps {
    post_id: string;
    isOpen: boolean;
    commentCount?: number;
    comments: CommentData[];
    className?: string;
}

interface CommentProps {
    userName: string;
    content: string;
    userAvatar?: string;
    className?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  post_id,
  isOpen,
  comments,
  className
}) => {
//   const [sortBy, setSortBy] = useState<string>("most-relevant");
  const [comment, setComment] = useState<string>("");


  if (!isOpen) return null;

  const handleComment = async () => {
    try {
        const response = await fetch(`/api/postAction/?post_id=${post_id}&type=comment`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comment
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to comment');
        }
        
        // Handle successful comment
        console.log('commented successfully');
        setComment(""); // Clear the input after successful comment
    } catch (error) {
        console.error('Error commenting post:', error);
    }
  }
  return (
    <div className={cn("border-t border-gray-200 pt-3", className)}>
      {/* Comment input area */}
      <div className="flex gap-3 mb-4">
        <ProfileAvatar size="xs" />
        <div className="flex-1 relative">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
            className="w-full p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && comment.trim()) {
                handleComment();
              }
            }}
          />
        </div>
          {/* <div className=" flex gap-2 ">
            <button aria-label="add-image" className="text-gray-500 cursor-pointer hover:text-gray-700">
              <Image size={18} />
            </button>
            <button aria-label="add-reaction" className="text-gray-500 hover:text-gray-700">
              <Smile size={18} />
            </button>
          </div> */}
      </div>

      {/* Sort options */}
      <div className="flex items-center mt-5">
        {/* <button 
          className="flex cursor-pointer items-center gap-1 text-sm font-medium"
          onClick={() => setSortBy(sortBy === "most-relevant" ? "newest" : "most-relevant")}
        >
          {sortBy === "most-relevant" ? "Most Relevant" : "Newest"}
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button> */}
        <h1>Comments</h1>
      </div>

      {/* Comments list */}
      <div className="space-y-1">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment._id}
              userName={comment.user_id.username}
              content={comment.comment}
              userAvatar={comment.user_id.profileImage}
            />
          ))
        ) : (
            <p className="text-gray-500 items-center text-sm">No comments available.</p>
        )}
      </div>
    </div>
  )
};





const Comment: React.FC<CommentProps> = ({
    userName,
    content,
    userAvatar,
    className
}) => {
    
    return (
        <div className={cn("flex gap-3 py-4", className)}>
        <div className="w-fit h-fit">
            <ProfileAvatar src={userAvatar} size="xs" />
        </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm">{userName}</h4>
        {/* <div className="flex items-center gap-2">
            <button aria-label="more-optionss" className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={16} />
            </button>
          </div> */}
        </div>
        
        <p className="mt-1 text-sm">{content}</p>
        
        {/* <div className="flex gap-4 mt-2">
          <button className="text-xs text-gray-500 hover:text-gray-700">Like</button>
          <span className="text-xs text-gray-300">|</span>
          <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
        </div> */}
      </div>
    </div>
  );
};

export default CommentSection;
