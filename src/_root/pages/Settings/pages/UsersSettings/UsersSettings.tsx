import { useGetAllUsers } from "@/lib/react-query/auth/authQueries"
import { columns } from "./DataTable/columns"
import { DataTable } from "./DataTable/data-table"
import Loader from "@/components/shared/Loader"
import { useEffect, useState } from "react"
import { User } from "@/types"

const UsersSettings = () => {
  const [data, setData] = useState<User[]>([]);
  const { data: allUsers, isLoading } = useGetAllUsers()


  useEffect(() => {
    if (!allUsers) return

    setData(allUsers);

  }, [allUsers, isLoading]);

  if (isLoading) return <Loader color="lightgray" />;

  return (
    <div className="w-full">
      <div className="p-4">
        <h2 className="w-full text-xl font-semibold pb-4">List Karyawan</h2>

        {/* <div className="flex justify-end w-full py-2 mt-8">
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
        </div> */}

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default UsersSettings