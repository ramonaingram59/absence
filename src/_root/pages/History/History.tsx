import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";
import { useGetHistoryRecord } from "@/lib/react-query/absent/queries";
import { cn } from "@/lib/utils";
import { ROLE } from "@/types";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { DataTable } from "./DataTable/data-table";
import { AttendanceRecord, columns } from "./DataTable/columns";
import Loader from "@/components/shared/Loader";

// interface IHistory {
//   id: string ;
//   userId?: string;
//   date: string | null;
//   inTime: string | null;
//   outTime: string | null;
//   status: string | null;
//   fullName: string | null;
// }

const Explore = () => {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const debounceDate = useDebounce(date, 1000);

  const { user, isLoading: isUserLoading } = useUserContext();

  const isAdmin = user?.role === ROLE.ADMIN;

  const { data: history, isPending: isHistoryLoading } = useGetHistoryRecord(
    isAdmin ? "" : user?.id,
    debounceDate
  );

  useEffect(() => {
    if (!history || !user) return;

    const transformedData: AttendanceRecord[] = history.map((item) => ({
      id: item.id,
      userId: item.userId,
      date: item.date,
      inTime: item.inTime,
      outTime: item.outTime,
      status: item.status,
      fullName: item.Users?.name ?? '',
    }));

    setData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(transformedData)) {
        return transformedData;
      }
      return prevData;
    });
  }, [user, history, debounceDate]);

  if (isUserLoading || isHistoryLoading) return <Loader />;
  return (
    <div className="w-full explore-container">
      <div className="p-4">
        <h2 className="w-full text-xl font-semibold">Riwayat Absensi</h2>

        <div className="gap-1 px-4 rounded-lg bg-dark-4">
          {/* <Input
            type="text"
            placeholder="Search.."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          /> */}
        </div>

        <div className="flex justify-end w-full py-2 mt-8">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  "ml-auto"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "MMM dd, y")} -{" "}
                      {format(date.to, "MMM dd, y")}
                    </>
                  ) : (
                    format(date.from, "MMM dd, y")
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

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Explore;
