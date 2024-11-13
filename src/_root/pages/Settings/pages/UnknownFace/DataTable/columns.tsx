import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUnknownFace } from "@/lib/react-query/face/faceQueries";
import { formatDateTimeWIB } from "@/lib/utils";
import { Json } from "@/types/supabase";
import { ColumnDef, Row } from "@tanstack/react-table";
import { toast } from "sonner";


type UnknownFaceRecord = {
  faceDescriptor: Json | null;
  faceImage: string | null;
  id: string;
  notes: string | null;
  timestamp: string | null;
}

type Props = {
  row: Row<UnknownFaceRecord>

}

const ActionCell: React.FC<Props> = ({ row }) => {
  const id = row.original.id;
  const faceImage = row.original.faceImage;
  const timestamp = row.original.timestamp;

  const { mutateAsync: deleteUnknownFace } = useDeleteUnknownFace()

  const handleDeleteUser = async (id: string) => {

    await deleteUnknownFace({ id }, {
      onSuccess() {
        toast.success("Success deleting unknown face.")
      },
    })
  }

  const handleDownloadImage = () => {
    if (!faceImage) return;
    const link = document.createElement('a');
    link.href = faceImage;
    link.download = `${timestamp}-face-image.png`
    link.click();
  }

  return (
    <div className="flex flex-row gap-1">
      <Button size={"sm"} variant={"outline"} onClick={handleDownloadImage}>
        Download Image
      </Button>
      <Button size={"sm"} variant={"outline"} >
        <AlertDialog>
          <AlertDialogTrigger>Delete</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteUser(id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </Button>
    </div>
  );
};

export const columns: ColumnDef<UnknownFaceRecord>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ cell }) => {
      let count = cell.row.index;

      return <div>{count + 1}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: () => <div className="">Tanggal dan Waktu</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("timestamp");
      return <div className="capitalize">{formatDateTimeWIB(user)}</div>;
    },
  },
  {
    accessorKey: "faceImage",
    header: () => <div className="">Face Image</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("faceImage");
      return <div className="relative h-[10rem] w-[10rem] min-w-fit overflow-hidden rounded flex justify-center items-center" >
        <img
          alt={user}
          src={user}
          className="absolute object-cover"
        />
      </div>
    },
  },
  {
    accessorKey: "notes",
    header: () => <div className="">Notes</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("notes");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">Action</div>,
    cell: ActionCell
  },

];
