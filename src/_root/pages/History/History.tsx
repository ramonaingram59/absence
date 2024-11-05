import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Explore = () => {
  // const [searchValue, setSearchValue] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const debounceDate = useDebounce(date, 500);


  return (
    <div className="explore-container w-full">
      <div className="p-4">
        <h2 className="w-full font-semibold text-xl">Riwayat Absensi</h2>

        <div className="flex w-full gap-1 px-4 rounded-lg bg-dark-4">
          {/* <Input
            type="text"
            placeholder="Search.."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          /> */}
        </div>

        <div className="mt-8">
          <Popover>
            <PopoverTrigger asChild >
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

      </div>


    </div>
  );
};

export default Explore;
