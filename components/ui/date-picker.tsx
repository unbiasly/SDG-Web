"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
  className?: string
}

export function DatePicker({ 
  selected, 
  onSelect, 
  placeholder = "Select date",
  disabled,
  className = ""
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="w-full justify-between font-normal"
          >
            {selected ? selected.toLocaleDateString() : placeholder}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0 pointer-events-auto" align="start">
          <Calendar
            mode="single"
            selected={selected}
            captionLayout="dropdown"
            onSelect={(date) => {
              onSelect?.(date)
              setOpen(false)
            }}
            disabled={disabled}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
