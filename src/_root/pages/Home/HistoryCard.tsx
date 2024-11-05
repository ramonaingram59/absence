import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetHistoryRecord } from "@/lib/react-query/absent/queries";
import { formatDate } from "@/lib/utils";
import { ROLE, User } from "@/types";

const HistoryCard = ({ user }: { user?: User }) => {
  const isAdmin = user?.role === ROLE.ADMIN;

  // const { data, isPending } = useGetHistoryRecord(isAdmin ? '' : user?.id)

  // console.log(data, 'his')

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

        <CardContent className="py-1">
          <div className="flex flex-row w-full gap-4">
            <div className="flex-1">
              <p className="text-base font-medium text-muted-foreground">
                {formatDate(new Date())}
              </p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-lg font-medium">
                  08:37
                  {/* HEREEEE */}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end flex-1 gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sudah diproses
              </p>
              <div className="w-6 h-6 bg-green-400 rounded-lg">
                <img src="/assets/icons/face-scan.svg" />
              </div>
            </div>
          </div>
        </CardContent>
        <Separator orientation="horizontal" className="m-auto w-80" />

        <CardContent className="py-1">
          <div className="flex flex-row w-full gap-4">
            <div className="flex-1">
              <p className="text-base font-medium text-muted-foreground">
                {formatDate(new Date())}
              </p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-lg font-medium">
                  08:37
                  {/* HEREEEE */}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end flex-1 gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sudah diproses
              </p>
              <div className="w-6 h-6 bg-green-400 rounded-lg">
                <img src="/assets/icons/face-scan.svg" />
              </div>
            </div>
          </div>
        </CardContent>
        <Separator orientation="horizontal" className="m-auto w-80" />

        <CardContent className="py-1">
          <div className="flex flex-row w-full gap-4">
            <div className="flex-1">
              <p className="text-base font-medium text-muted-foreground">
                {formatDate(new Date())}
              </p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-lg font-medium">
                  08:37
                  {/* HEREEEE */}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end flex-1 gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sudah diproses
              </p>
              <div className="w-6 h-6 bg-green-400 rounded-lg">
                <img src="/assets/icons/face-scan.svg" />
              </div>
            </div>
          </div>
        </CardContent>
        <Separator orientation="horizontal" className="m-auto w-80" />

        <CardContent className="py-1">
          <div className="flex flex-row w-full gap-4">
            <div className="flex-1">
              <p className="text-base font-medium text-muted-foreground">
                {formatDate(new Date())}
              </p>
              <div className="flex flex-row items-end gap-4">
                <p className="text-lg font-medium">
                  08:37
                  {/* HEREEEE */}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end flex-1 gap-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sudah diproses
              </p>
              <div className="w-6 h-6 bg-green-400 rounded-lg">
                <img src="/assets/icons/face-scan.svg" />
              </div>
            </div>
          </div>
        </CardContent>

        <Separator orientation="horizontal" className="m-auto w-80" />

        <CardFooter className="flex items-center justify-center w-full py-4">
          <Button className="w-full" variant={"ghost"}>
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HistoryCard;
