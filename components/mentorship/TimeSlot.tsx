import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
    time: string;
    available: boolean;
    selected?: boolean;
}

export const TimeSlot = ({
    time,
    available,
    selected = false,
}: TimeSlotProps) => {
    return (
        <Button
            variant={selected ? "default" : "outline"}
            className={cn(
                "h-12 text-lg font-medium rounded-xl",
                selected && "bg-blue-600 hover:bg-blue-700 text-white",
                !available && "opacity-50 cursor-not-allowed"
            )}
            disabled={!available}
        >
            {time}
        </Button>
    );
};
