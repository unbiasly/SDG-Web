import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimeSlotProps {
    time: string;
    available: boolean;
    selected?: boolean;
    onClick?: () => void;
}

export const TimeSlot = ({
    time,
    available,
    selected = false,
    onClick,
}: TimeSlotProps) => {
    return (
        <Button
            variant={selected ? "default" : "outline"}
            onClick={onClick}
            className={cn(
                "h-12 text-lg font-medium rounded-xl text-black",
                selected && "bg-accent hover:bg-accent/80 text-white",
                !available && "opacity-50 bg-gray-300 cursor-not-allowed"
            )}
            disabled={!available}
        >
            {format(time ? new Date(time) : new Date(), "hh:mm a")}
        </Button>
    );
};
