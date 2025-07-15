import { Card, CardContent } from "@/components/ui/card";
import { MentorshipCategory } from "@/service/api.interface";
import { de } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

interface MentorshipCardProps {
    category: MentorshipCategory;
}

export const MentorshipCard = ({ category }: MentorshipCardProps) => {
    let imgSrc = "";
    switch (category.name) {
        case "Career Guidance":
            imgSrc = "/icons/mentorship/Career-Guidance.svg";
            break;
        case "Admission Assistance":
            imgSrc = "/icons/mentorship/Admission-Assistance.svg";
            break;
        case "Personality Development":
            imgSrc = "/icons/mentorship/Personality-Development.svg";
            break;
        default:
            imgSrc = category.icon;
            break;
    }

    return (
        <div className="overflow-hidden border-2 p-4 lg:p-6 rounded-3xl">
            <Link href={`/mentorship/mentors?category=${category._id}`}>
                <div className="flex lg:flex-col items-center  gap-4">
                    <div className="w-full h-32 lg:h-48 mb-4">
                        <Image
                            src={imgSrc}
                            alt={category.name}
                            className="w-full h-full object-contain rounded-2xl"
                            width={2000}
                            height={2000}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg lg:text-xl font-bold">
                            {category.name}
                        </h3>
                        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                            {category.description}
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
};
