import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const BackPageHeader = ({headerTitle, onBackClick}:{headerTitle:string, onBackClick?: () => void}) => {
    const router = useRouter();
    return (
        <div className="top-0 bg-white z-10 flex items-center p-3 border-b border-gray-200">
            <button onClick={onBackClick ? onBackClick : router.back} aria-label="back-button" className="mr-4">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold flex-1">{headerTitle}</h1>
        </div>
    );
};

export default BackPageHeader;
