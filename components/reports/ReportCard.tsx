import { formatDate } from "@/lib/utilities/formatDate";
import { SDG_Report } from "@/service/api.interface";
import { Download } from "lucide-react";
import React from "react";

const ReportCard: React.FC<SDG_Report> = ({
    _id,
    category,
    createdAt,
    report_url,
    thumbnail_url,
    title,
}) => {
    let formattedCategory = category;
    switch (category) {
        case "undp":
            formattedCategory = "UNDP";
            break;
        case "niti-aayog":
            formattedCategory = "NITI Aayog";
            break;
        case "state":
            formattedCategory = "State";
            break;
        case "ministry":
            formattedCategory = "Ministry";
            break;
        default:
            formattedCategory = "";
            break;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Report Image */}
            {thumbnail_url && (
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-green-50 p-4">
                    <img
                        src={thumbnail_url}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            )}

            {/* Report Details */}
            <div className="p-4 flex flex-col h-full">
                <div className="flex-grow">
                    <h3 className="text-base line-clamp-2  font-bold text-accent mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-1">{formattedCategory}</p>
                </div>
                {/* Date and Download Button */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500 font-medium">
                        {formatDate(createdAt)}
                    </span>
                    <button
                        onClick={() => {
                            if (report_url && report_url.startsWith("http")) {
                                window.open(
                                    report_url,
                                    "_blank",
                                    "noopener,noreferrer"
                                );
                            }
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        aria-label={`Download ${title} report`}
                    >
                        {/* existing button content */}
                        <Download className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;
