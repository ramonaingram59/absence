import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import TodayCard from "./TodayCard";
import HistoryCard from "./HistoryCard";


const Home = () => {
  // const { data: posts, isPending: isPostLoading } = useGetRecentPosts();
  const { data: user, isPending: isUserLoading } = useGetCurrentUser()

  if (isUserLoading) return <Loader />


  return (
    <div className="flex flex-1 px-4 flex-col">

      <div className="w-full py-4">
        <h2 className="text-left font-semibold">
          Hello,
        </h2>
        <div>
          <h2 className="text-xl font-semibold italic">
            {user?.name}
          </h2>
          <h3 className="capitalize text-muted-foreground text-sm font-normal not-italic">
            {user?.position ? user?.position + ' - ' : ''}  {user?.departement} department
          </h3>
        </div>
      </div>

      <TodayCard />

      {
        user && <HistoryCard user={user} />
      }

    </div>
  );
};

export default Home;
