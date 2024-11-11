import { allFaces, saveFaces } from "@/lib/appwrite/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllFaces = () => {
  return useQuery({
    queryKey: ["GET_ALL_FACES"],
    queryFn: allFaces,
    refetchOnWindowFocus: false,
  });
};

export const useSaveFaceDescriptors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (descriptor: Float32Array) => saveFaces(descriptor),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GET_ALL_FACES"],
      });
    },
  });
};