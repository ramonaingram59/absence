import Loader from "@/components/shared/Loader";
import TodayCard from "./TodayCard";
import HistoryCard from "./HistoryCard";
import { useUserContext } from "@/context/AuthContext";
import { ROLE } from "@/types";
import { useGetHistoryRecord } from "@/lib/react-query/absent/queries";

const Home = () => {
  const { user, isLoading: isUserLoading } = useUserContext();

  const isAdmin = user?.role === ROLE.ADMIN;

  const { data: history, isPending: isHistoryLoading } = useGetHistoryRecord(
    isAdmin ? "" : user?.id
  );

  if (isUserLoading || isHistoryLoading) return <Loader />;

  return (
    <div className="flex flex-col flex-1 px-4">
      <div className="w-full py-4">
        <h2 className="font-semibold text-left">Hello,</h2>
        <div>
          <h2 className="text-xl italic font-semibold">{user?.name}</h2>
          <h3 className="text-sm not-italic font-normal capitalize text-muted-foreground">
            {user?.position ? user?.position + " - " : ""} {user?.departement}{" "}
            department
          </h3>
        </div>
      </div>

      <TodayCard />

      {user && <HistoryCard user={user} history={history} />}
    </div>
  );
};

export default Home;
