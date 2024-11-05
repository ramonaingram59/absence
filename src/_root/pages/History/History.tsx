import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useState } from "react";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const debounceVal = useDebounce(searchValue, 500);


  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="w-full h3-bold md:h2-bold">Search</h2>

        <div className="flex w-full gap-1 px-4 rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={18}
            height={18}
            alt="search"
          />

          <Input
            type="text"
            placeholder="Search.."
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full max-w-5xl mt-16 flex-between mb-7">
        <h3 className="body-bold md:h3-bold">Populars</h3>

        <div className="gap-3 px-4 py-2 cursor-pointer flex justify-center items-center bg-dark-3 rounded-xl">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={18}
            height={18}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap w-full max-w-5xl gap-9">
      </div>

    </div>
  );
};

export default Explore;
