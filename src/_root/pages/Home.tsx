import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";

const Home = () => {
  // const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="w-full text-left h3-bold md:h2-bold">Feeds</h2>

        </div>
      </div>
    </div>
  );
};

export default Home;
