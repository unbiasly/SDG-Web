import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CareerSection: React.FC<{
    title: string;
    children: React.ReactNode;
    className?: string;
    onAddClick?: () => void;
    authUser?: boolean;
  }> = ({ title, children, className, onAddClick, authUser }) => {
    
    return (
      <div className={cn('py-6 border-b border-t border-profile-border', className)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            {authUser && onAddClick && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      aria-label={`Add ${title.toLowerCase()}`} 
                      className="flex items-center gap-1  rounded-full hover:bg-gray-100 transition-colors border-none cursor-pointer border-gray-300"
                      onClick={onAddClick}
                    >
                      <Plus size={30} className="text-gray-700" />
                      {/* <span className="text-sm font-medium">Add {title.toLowerCase()}</span> */}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new {title.toLowerCase()} entry to your profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {children}
      </div>
    );
  };