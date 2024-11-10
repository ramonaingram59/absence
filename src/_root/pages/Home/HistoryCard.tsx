import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatTime } from "@/lib/utils";
import { AttendanceRecord, User } from "@/types";
import { Link } from "react-router-dom";

interface HistoryProps {
  user: User;
  history?: AttendanceRecord[];
}

const HistoryCard = ({ user, history }: HistoryProps) => {

  console.log(user)
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-lg">History</span>
          </CardTitle>
          {/* <CardDescription>
            Shift: Fixed 9 hours (08:30 - 17:30)
          </CardDescription> */}
        </CardHeader>
        <Separator orientation="horizontal" />

        {history?.map((item, idx) => (
          <div key={idx}>
            <CardContent className="py-1">
              <div className="flex flex-row w-full gap-4">
                <div className="flex-1">
                  <p className="text-base font-medium text-muted-foreground whitespace-nowrap">
                    {formatDate(item?.date)}
                  </p>
                  <div className="flex flex-row items-center gap-4 cursor-pointer">
                    <p className="flex items-center justify-center p-1 px-2 text-lg font-medium border rounded-lg whitespace-nowrap">
                      {item?.inTime && formatTime(item?.inTime)}
                    </p>
                    <span>-</span>
                    <p className="flex items-center justify-center p-1 px-2 text-lg font-medium border rounded-lg whitespace-nowrap">
                      {item?.outTime ? formatTime(item?.outTime) : "--:--"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-end flex-1 gap-2">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Sudah diproses
                  </p>
                  <div className="w-6 h-6 bg-green-400 rounded-lg">
                    <img src="/assets/icons/face-scan.svg" />
                  </div>
                </div>
              </div>
            </CardContent>
            <Separator orientation="horizontal" className="m-auto w-80" />
          </div>
        ))}

        <CardFooter className="flex items-center justify-center w-full py-4">
          <Link
            to={"/history"}
            className={cn(buttonVariants({ variant: "ghost" }), "min-w-48")}
          >
            View All
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HistoryCard;
