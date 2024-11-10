import { formatDate, formatTime, formatTimeWIB } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export type AttendanceRecord = {
  id: string;
  date: string | null;
  inTime: string | null;
  outTime: string | null;
  status: string | null;
  userId: string;
  fullName: string;
};

// interface Props {
//   row: Row<AttendanceRecord>; // Define the type for the row object
// }

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ cell }) => {
      let count = cell.row.index;

      return <div>{count + 1}</div>;
    },
  },
  {
    accessorKey: "userId",
    header: "User Id",
    cell: ({ row }) => (
      <div className="overflow-hidden text-left whitespace-nowrap text-ellipsis max-w-16 direction-reverse">
        {row.getValue("userId")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: () => <div className="">Tanggal</div>,
    cell: ({ row }) => {
      const date: Date = row.getValue("date");

      return (
        <div className="">
          {/* {date.slice(0, 10)} {`${date.slice(11, 13)}:${date.slice(14, 16)}`} */}
          {formatDate(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: () => <div className="">Full Name</div>,
    cell: ({ row }) => {
      const user: string = row.getValue("fullName");
      return <div className="capitalize">{user}</div>;
    },
  },
  {
    accessorKey: "inTime",
    header: () => <div className="text-center">Waktu masuk</div>,
    cell: ({ row }) => {
      const time: Date = row.getValue("inTime");
      return (
        <div className="font-medium text-center">{formatTimeWIB(time)}</div>
      );
    },
  },
  {
    accessorKey: "outTime",
    header: () => <div className="text-center">Waktu keluar</div>,
    cell: ({ row }) => {
      const time: Date = row.getValue("outTime");
      return (
        <div className="font-medium text-center">{formatTimeWIB(time)}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return <div className="font-medium text-center uppercase">{status}</div>;
    },
  },
];
