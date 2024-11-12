import { allFaces, saveFaces } from "@/lib/appwrite/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";

export const useGetAllFaces = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_FACES],
    queryFn: allFaces,
    refetchOnWindowFocus: false,
  });
};

export const useSaveFaceDescriptors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, descriptor }: { userId: string, descriptor: Float32Array }) => saveFaces({ userId, descriptor }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_FACES],
      });
    },
  });
};