import { useGetAllUsers } from "@/lib/react-query/auth/authQueries"
import { columns } from "./DataTable/columns"
import { DataTable } from "./DataTable/data-table"
import Loader from "@/components/shared/Loader"
import { useEffect, useState } from "react"
import { User } from "@/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowDownFromLine } from "lucide-react"
import { toast } from "sonner"
import { exportUserToExcel } from "@/lib/excel/create-excel"

const UsersSettings = () => {
  const [data, setData] = useState<User[]>([]);
  const { data: allUsers, isLoading } = useGetAllUsers()

  console.log({ allUsers })
  useEffect(() => {
    if (!allUsers) return

    setData(allUsers);

  }, [allUsers, isLoading]);

  if (isLoading) return <Loader color="lightgray" />;

  const handleExportToExcel = async () => {

    if (!allUsers || allUsers.length == 0) {
      toast.error('Data is empty, please select date')
      return
    }
    await exportUserToExcel(allUsers)
  }

  return (
    <div className="w-full">
      <div className="p-4">
        <div className="flex flex-row justify-between py-2">
        <h2 className="w-full text-xl font-semibold pb-4">List Karyawan</h2>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
            )}
            onClick={handleExportToExcel}
          >
            <ArrowDownFromLine /> Download Excel
          </Button>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default UsersSettings