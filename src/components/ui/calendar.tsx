"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, Formatters } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const formatters: Partial<Formatters> = {
    formatWeekdayName: (date, options) => {
      const weekdayNames = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
      return weekdayNames[date.getDay()];
    },
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      formatters={formatters}
      classNames={{
        months: "flex flex-row gap-6",
        month: "flex flex-col gap-3",
        caption: "flex justify-center pt-1 relative items-center w-full mb-2 px-0",
        caption_label: "text-sm font-semibold text-gray-900",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-white border-gray-200 p-0 opacity-70 hover:opacity-100 hover:bg-gray-50 z-10",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex mb-2 gap-3",
        head_cell:
          "text-gray-700 rounded-md w-9 h-9 flex items-center justify-center font-semibold text-sm flex-shrink-0",
        row: "flex w-full mt-1 gap-1.5",
        cell: cn(
          "relative p-0 text-center w-9 h-9 flex-shrink-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-green-50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100 cursor-pointer pointer-events-auto hover:bg-gray-100 text-gray-700",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-green-400 aria-selected:text-gray-900 aria-selected:font-semibold rounded-l-md",
        day_range_end:
          "day-range-end aria-selected:bg-green-400 aria-selected:text-gray-900 aria-selected:font-semibold rounded-r-md",
        day_selected:
          "bg-green-400 text-gray-900 font-semibold hover:bg-green-500 hover:text-gray-900 focus:bg-green-400 focus:text-gray-900",
        day_today: "bg-gray-100 text-gray-900 font-semibold border border-gray-300",
        day_outside:
          "day-outside text-gray-400 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-green-50 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
