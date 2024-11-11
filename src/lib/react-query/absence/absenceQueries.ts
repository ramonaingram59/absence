import {
  addRecordAttendance,
  getHistoryRecord,
} from "@/lib/actions/api/absent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";
import { DateRange } from "react-day-picker";

export const useGetHistoryRecord = (
  userId?: string,
  range?: DateRange,
  limit?: number
) => {
  return useQuery({
    queryFn: () => getHistoryRecord(userId, range, limit),
    queryKey: [QUERY_KEYS.GET_HISTORY_RECORD, userId, range],
    refetchOnWindowFocus: false,
  });
};

export const useAddRecordAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { userId?: string; time?: Date }>({
    mutationFn: ({ userId, time }) => addRecordAttendance(userId, time),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HISTORY_RECORD],
      });
    },
  });
};
