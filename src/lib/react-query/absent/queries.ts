import { getHistoryRecord } from "@/lib/actions/api/absent";
import {
  useQuery
} from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";


export const useGetHistoryRecord = (userId?: string) => {
  return useQuery({
    queryFn: () => getHistoryRecord(userId),
    queryKey: [QUERY_KEYS.GET_HISTORY_RECORD, userId],
    refetchOnWindowFocus: false,
  });
};
