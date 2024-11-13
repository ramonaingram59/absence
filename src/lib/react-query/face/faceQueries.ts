import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKey";
import { allUnknownFaces, deleteUnknownFace, recordUnknownFaces } from "@/lib/actions/api/unknown-face";
import { allFaces, saveFaces } from "@/lib/actions/api/faces";

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

export const useRecordUnknownFaces = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      descriptor,
      faceImage,
      timestamp
    }: {
      faceImage: string,
      timestamp: Date,
      descriptor: Float32Array
    }) => recordUnknownFaces({
      descriptor,
      faceImage,
      timestamp
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_UNKNOWN_FACES],
      });
    },
  });
};

export const useGetAllUnknownFaces = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_UNKNOWN_FACES],
    queryFn: () => allUnknownFaces(limit),
    refetchOnWindowFocus: false,
  });
};


export const useDeleteUnknownFace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUnknownFace({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_UNKNOWN_FACES],
      });
    },

  });
};
