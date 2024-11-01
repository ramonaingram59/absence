import { useGetHistoryRecord } from "@/lib/react-query/absent/queries"
import { ROLE, User } from "@/types"

const HistoryCard = ({ user }: { user?: User }) => {

  const isAdmin = user?.role === ROLE.ADMIN

  const { data, isPending } = useGetHistoryRecord(isAdmin ? '' : user?.id)

  console.log(data, 'his')

  return (
    <div>
      History
      { }
    </div>
  )
}

export default HistoryCard