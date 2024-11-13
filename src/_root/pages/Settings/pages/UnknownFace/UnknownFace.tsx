import { useGetAllUnknownFaces } from "@/lib/react-query/face/faceQueries"
import { columns } from "./DataTable/columns"
import { DataTable } from "./DataTable/data-table"
import Loader from "@/components/shared/Loader"
import { useEffect, useState } from "react"
import { UnknownFaceRecord } from "@/types"

const UnknownFace = () => {
  const [data, setData] = useState<UnknownFaceRecord[]>([]);

  const { data: allUnknownFaces, isLoading } = useGetAllUnknownFaces()

  useEffect(() => {
    if (!allUnknownFaces) return

    setData(allUnknownFaces);

  }, [allUnknownFaces, isLoading]);


  if (isLoading) return <Loader color="lightgray" />

  return (
    <div className="w-full">
      <div className="p-4">
        <h2 className="w-full text-xl font-semibold pb-4">List Wajah yang tidak dikenali</h2>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default UnknownFace