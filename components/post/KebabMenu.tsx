import { Flag, MoreVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ReportPopover from "./ReportPopover";

interface KebabMenuProps {
  postId: string;
}

const KebabMenu = ({ postId }: KebabMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleReportClick = () => {
    setIsOpen(false);
    setReportOpen(true);
  };

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
            <button 
              className="w-full cursor-pointer text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
              onClick={handleReportClick}
            >
              <Flag className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Report post</span>
            </button>
          </div>
        </div>
      )}
      
      <ReportPopover open={reportOpen} onOpenChange={setReportOpen} postId={postId} />
    </div>
  );
};

export default KebabMenu;