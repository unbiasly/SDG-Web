import { Bookmark, Flag, MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import ReportPopover from "./ReportPopover";
import { useUser } from "@/lib/redux/features/user/hooks";
import EditPost from "./EditPost";

interface PostMenuProps {
  postId: string;
  userId: string;
  isBookmarked: boolean;
}

const PostMenu = ({ postId, userId, isBookmarked }: PostMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [deletePostOpen, setDeletePostOpen] = useState(false);
  const [isActive, setIsActive] = useState(isBookmarked);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const { user } = useUser();

  const currentUserId = user?._id;
  
  const handleReportClick = () => {
    setIsOpen(false);
    setReportOpen(true);
  };
  const handleBookmark = async () => {
    try {
        // Optimistically update UI
        const newBookmarkState = !isActive;
        setIsActive(newBookmarkState);
        
        const response = await fetch(`/api/post/post-action/?post_id=${postId}&type=bookmark`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            // Revert changes if API call fails
            setIsActive(!newBookmarkState);
            throw new Error('Failed to bookmark post');
        }
        
        // Get updated data from API response
        const data = await response.json();
        console.log('Bookmark updated successfully', data);
    } catch (error) {
        console.error('Error bookmarking post:', error);
    }
  }
    const handleEditPost = () => {
      setIsOpen(false);
      setEditPostOpen(true);
    }
    const handleDeletePost = () => {
      setIsOpen(false);
      setDeletePostOpen(true);
    }

    const menuOptions = [
        { icon: <Flag className="h-5 w-5 text-gray-500" />, label: "Report post", onClick: handleReportClick },
        { icon: <Bookmark className={`h-5 w-5 ${isActive ? "fill-current text-accent" : "text-gray-500"}`} />, label: isBookmarked ? "Unsave post" : "Save post", onClick: handleBookmark },
        ...(userId === currentUserId ? [
          { icon: <Pencil className="h-5 w-5 text-gray-500" />, label: "Edit post", onClick: handleEditPost },
          { icon: <Trash className="h-5 w-5 text-gray-500" />, label: "Delete post", onClick: handleDeletePost },
        ] : []),
      ];

  return (
    <div className="relative">
      <button 
        onClick={toggleMenu}
        className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="h-5 w-5 text-gray-500" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg z-50 border border-gray-100 overflow-hidden"
          onClick={closeMenu}
        >
          <div className="py-1">
            {menuOptions.map((item, index) => (
              <button 
                key={index}
                className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
                onClick={item.onClick}
              >
                {item.icon}
                <span className="text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <ReportPopover open={reportOpen} onOpenChange={setReportOpen} postId={postId} />
      <EditPost open={editPostOpen} onOpenChange={setEditPostOpen} postId={postId} />
    </div>
  );
};

export default PostMenu;