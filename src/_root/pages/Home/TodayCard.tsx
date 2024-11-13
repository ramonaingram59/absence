import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatDateWIB, formatTimeWIB } from "@/lib/utils";
import { AttendanceRecord } from "@/types";
import { Link } from "react-router-dom";

interface HistoryProps {
  history?: AttendanceRecord[];
}



const TodayCard = ({ history }: HistoryProps) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Find today's record
  const todayRecord = history?.find(record => record.date === today);

  // Format inTime and outTime
  const inTimeFormatted = todayRecord?.inTime ? formatTimeWIB(todayRecord.inTime) : '--:--';
  const outTimeFormatted = todayRecord?.outTime ? formatTimeWIB(todayRecord.outTime) : '--:--';


  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-xl">Today ( {formatDateWIB(new Date())} )</span>
          </CardTitle>
          <CardDescription>
            Shift: Fixed 9 hours (08:30 - 17:30)
          </CardDescription>
        </CardHeader>

        <Separator orientation="horizontal" />

        <CardContent className="py-4">
          <div className="flex flex-row w-full gap-4">
            <div className="flex-1">
              <p className="font-medium text-muted-foreground">Start Time</p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-xl font-medium">
                  {inTimeFormatted}
                </p>
                <div className="w-6 h-6 rounded-lg bg-primary">
                  <img src="/assets/icons/face-scan.svg" />
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-16 my-1" />

            <div className="flex-1">
              <p className="font-medium text-muted-foreground">End Time</p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-xl font-medium">
                  {outTimeFormatted}
                </p>
                <div className="w-6 h-6 rounded-lg bg-primary-foreground">
                  <img src="/assets/icons/face-scan.svg" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator orientation="horizontal" />

        <CardFooter className="flex items-center justify-center w-full py-4">
          <Link to={"/scan"} className={cn(buttonVariants(), "w-full")}>
            Record Time
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TodayCard;
