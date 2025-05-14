import { Search } from "lucide-react";

const JobSearch = () => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md border-none focus:ring-0 text-sm"
      />
    </div>
  );
};

export default JobSearch;
