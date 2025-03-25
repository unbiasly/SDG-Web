
import { ChevronRight } from "lucide-react";
import { BriefcaseBusiness, FileCheck, FileText, FileEdit } from "lucide-react";

interface NotificationIconProps {
  type: string;
}

interface NotificationItemProps {
  type: string;
  title: string;
  time: string;
}

const Alerts = ({ type, title, time }: NotificationItemProps) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-300 cursor-pointer transition-colors animate-slide-up">
      <NotificationIcon type={type} />
      <div className="ml-4 flex-grow pr-4 overflow-hidden">
        <div className="text-xs text-gray-600 mb-1">{type}</div>
        <div className="text-sm font-medium text-black truncate">{title}</div>
      </div>
      <div className="text-xs text-gray-500 ml-2 mr-2">{time}</div>
      <div className="text-gray-400">
        <ChevronRight size={20} />
      </div>
    </div>
  );
};

export default Alerts;





const NotificationIcon = ({ type }: NotificationIconProps) => {
  switch (type) {
    case "New Job Alert":
      return (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center  flex-shrink-0 bg-[#1a4b6e]">
          <BriefcaseBusiness size={20} />
        </div>
      );
    case "The SDG Talks":
      return (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-[#ff7644]">
          <FileText size={20} />
        </div>
      );
    case "The SDG Event":
      return (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-[#4ca551]">
          <FileCheck size={20} />
        </div>
      );
    case "Followed by you":
      return (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-[#a02346]">
          <FileEdit size={20} />
        </div>
      );
    default:
      return (
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-gray-500">
          <FileText size={20} />
        </div>
      );
  }
};
