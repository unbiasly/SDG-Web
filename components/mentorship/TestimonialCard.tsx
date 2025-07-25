import { ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MentorReview } from "@/service/api.interface";
import Image from 'next/image';
import { format } from "date-fns";
import { formatDate } from "@/lib/utilities/formatDate";
import Link from "next/link";

interface TestimonialCardProps {
    review: MentorReview;
}

export const TestimonialCard = ({ review }: TestimonialCardProps) => {
    return (
        <div className="border-b-2  p-6">
            <div className="flex gap-4">
                <Image
                    src={review.user.profileImage || '/placeholder.png'}
                    alt={review.user.name || `@${review.user.username}`}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <Link href={`/profile/${review.user._id}`}>
                        <h4 className="font-bold text-base sm:text-lg mb-1 truncate hover:underline">
                            {review.user.name || `@${review.user.username}`}
                        </h4>
                    </Link>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                        {format(new Date(review.createdAt || new Date()), "MMMM dd, yyyy")}
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
};
