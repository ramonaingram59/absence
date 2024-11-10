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
import { cn, formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";

const TodayCard = () => {
  // Todo get hour from History

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-xl">Today ( {formatDate(new Date())} )</span>
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
                  08:30
                  {/* HEREEEE */}
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
                  --:--
                  {/* HEREEEE */}
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
