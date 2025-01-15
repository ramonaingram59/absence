import Loader from "@/components/shared/Loader";
import TodayCard from "./TodayCard";
import HistoryCard from "./HistoryCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetHistoryRecord } from "@/lib/react-query/absence/absenceQueries";

const Home = () => {
  const { user, isLoading: isUserLoading } = useUserContext();

  const { data: history, isPending: isHistoryLoading } = useGetHistoryRecord(
    user?.id,
    undefined,
    5
  );

  if (isUserLoading || isHistoryLoading) return <Loader color="lightgray" />;

  return (
    <div className="flex flex-col flex-1 px-4">
      <div className="w-full py-4">
        <h2 className="font-semibold text-left">Hello,</h2>
        <div>
          <div className="flex flex-row gap-4 items-center">
            <h2 className="text-xl italic font-semibold">{user?.name} </h2>
            <div className="text-sm italic capitalize shadow-sm text-white bg-green-800 rounded-md px-2">{user?.role}</div>
          </div>
          <h3 className="text-sm not-italic font-normal capitalize text-muted-foreground">
            {user?.position ? user?.position + " - " : ""} {user?.departement}{" "}
            department
          </h3>
        </div>
      </div>

      <TodayCard history={history} />

      {user && <HistoryCard user={user} history={history} />}
    </div>
  );
};

export default Home;
