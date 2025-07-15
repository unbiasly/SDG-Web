"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Calendar24Props {
    date?: Date;
    onDateTimeChange?: (date: Date | undefined, time: string) => void;
}

export function Calendar24({ date, onDateTimeChange }: Calendar24Props) {
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
    const [time, setTime] = React.useState<string>("10:30");

    // Use useCallback to prevent infinite re-renders
    const handleDateTimeChange = React.useCallback(() => {
        if (onDateTimeChange) {
            onDateTimeChange(selectedDate, time);
        }
    }, [selectedDate, time, onDateTimeChange]);

    // Only call the callback when date or time actually changes
    React.useEffect(() => {
        handleDateTimeChange();
    }, [handleDateTimeChange]);

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <label htmlFor="date-picker" className="px-1">
                    Date <span className="text-red-500">*</span>
                </label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            type="button"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                        >
                            {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0 pointer-events-auto"
                        align="start"
                    >
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            onSelect={(selectedDate) => {
                                setSelectedDate(selectedDate);
                                setOpen(false);
                            }}
                            disabled={(selectedDate) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return selectedDate < today;
                            }}
                            className="pointer-events-auto"
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <label htmlFor="time-picker" className="px-1">
                    Time <span className="text-red-500">*</span>
                </label>
                <Input
                    type="time"
                    id="time-picker"
                    step="60"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    );
}
