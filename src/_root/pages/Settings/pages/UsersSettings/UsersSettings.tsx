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

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default UsersSettings