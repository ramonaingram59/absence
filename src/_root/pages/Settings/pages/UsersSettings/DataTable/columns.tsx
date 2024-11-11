import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDeleteUserById } from "@/lib/react-query/auth/authQueries";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { toast } from "sonner";


type User = {
  authId: string;
  createdAt: string;
  departement: string | null;
  email: string;
  id: string;
  imageId: string | null;
  imageUrl: string | null;
  name: string | null;
  NIK: number | null;
  password: string | null;
  position: string | null;
  role: string | null;
  status: string | null;
  updatedAt: string | null;
}

type Props = {
  row: Row<User>

}

const ActionCell: React.FC<Props> = ({ row }) => {
  const userId = row.original.id;

  const { mutateAsync: deleteUserById } = useDeleteUserById()

  const handleDeleteUser = async (userId: string) => {

    await deleteUserById(userId, {
      onSuccess() {
        toast.success("Success deleting user.")
      },
    })
  }

  return (
    <div className="flex flex-row gap-1">
      <Link
        to={`/profile/${userId}`}
        className={cn(buttonVariants({ size: "sm", variant: "link" }))}>
        Edit
      </Link>
      <Button size={"sm"} variant={"outline"} >
        <AlertDialog>
          <AlertDialogTrigger>Delete</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteUser(userId)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </Button>
    </div>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ cell }) => {
      let count = cell.row.index;

      return <div>{count + 1}</div>;
    },
  },
  {
    accessorKey: "NIK",
    header: () => <div className="">NIK</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("NIK");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "name",
    header: () => <div>Full Name</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("name");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "departement",
    header: () => <div className="">Department</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("departement");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "position",
    header: () => <div className="">Position</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("position");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="">Status</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("status");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">Action</div>,
    cell: ActionCell
  },
  // {
  //   accessorKey: "userId",
  //   header: "User Id",
  //   cell: ({ row }) => (
  //     <div className="overflow-hidden text-left whitespace-nowrap text-ellipsis max-w-16 direction-reverse">
  //       {row.getValue("userId")}
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "date",
  //   header: () => <div className="">Tanggal</div>,
  //   cell: ({ row }) => {
  //     const date: Date = row.getValue("date");

  //     return (
  //       <div className="">
  //         {formatDate(date)}
  //       </div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: "inTime",
  //   header: () => <div className="text-center">Waktu masuk</div>,
  //   cell: ({ row }) => {
  //     const time: Date = row.getValue("inTime");
  //     return (
  //       <div className="font-medium text-center">{formatTimeWIB(time)}</div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "outTime",
  //   header: () => <div className="text-center">Waktu keluar</div>,
  //   cell: ({ row }) => {
  //     const time: Date = row.getValue("outTime");
  //     return (
  //       <div className="font-medium text-center">{formatTimeWIB(time)}</div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "status",
  //   header: () => <div className="text-center">Status</div>,
  //   cell: ({ row }) => {
  //     const status: string = row.getValue("status");
  //     return <div className="font-medium text-center uppercase">{status}</div>;
  //   },
  // },
];
