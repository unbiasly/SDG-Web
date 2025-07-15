import { ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MentorReview } from "@/service/api.interface";
import Image from 'next/image';

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
                    <h4 className="font-bold text-base sm:text-lg mb-1 truncate">
                        {review.user.name || `@${review.user.username}`}
                    </h4>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">
                        {review.createdAt}
                    </p>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    );
};
