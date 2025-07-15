import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryMentor } from "@/service/api.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileAvatar from "../profile/ProfileAvatar";

interface MentorProfileCardProps {
    mentor: CategoryMentor;
}

export const MentorProfileCard = ({ mentor }: MentorProfileCardProps) => {
    const router = useRouter();
    return (
        <div className="p-4 border-2 rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-2 lg:flex-row lg:justify-between w-full lg:items-center ">
                <div className="flex lg:justify-between items-center gap-4">
                    <ProfileAvatar src={mentor.user.profileImage || ''} alt={mentor.user.name}  userName={mentor.user.name || mentor.user.username} />

                    <div className="flex flex-col space-y-1 sm:space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold">
                            {mentor.user.name}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">{mentor.title}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {mentor.experience} year
                            {mentor.experience !== "1" ? "s" : ""} of expertise
                        </p>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm sm:text-base font-medium">
                                {mentor.reviewsCount} Reviews
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-col justify-between lg:justify-center lg:items-center">
                    <div className="text-left mb-2">
                        <p className="text-sm lg:text-base text-accent font-semibold">
                            Next available at
                        </p>
                        <p className="text-xs lg:text-sm text-muted-foreground whitespace-pre-line">
                            {new Date(mentor.availability).toLocaleString(
                                "en-US",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            router.push(`/mentorship/mentors/${mentor._id}`)
                        }
                        className="bg-accent hover:bg-accent/80 text-white px-3 lg:px-6 py-2 rounded-full"
                    >
                        Book a call
                    </Button>
                </div>
            </div>
        </div>
    );
};
