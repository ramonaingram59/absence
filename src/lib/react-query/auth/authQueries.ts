import { INewUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  deleteUserById,
  getAllDepartments,
  getAllUsers,
  getCurrentUser,
  getUserById,
  signInAccount,
  signOutAccount,
  updateUserById,
} from "../../actions/api/auth";
import { QUERY_KEYS } from "../queryKey";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryFn: getCurrentUser,
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    refetchOnWindowFocus: false,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryFn: () => getUserById(userId),
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    refetchOnWindowFocus: false,
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryFn: () => getAllUsers(),
    queryKey: [QUERY_KEYS.GET_ALL_USERS],
    refetchOnWindowFocus: false,
  });
};

export const useGetAllDepartments = () => {
  return useQuery({
    queryFn: () => getAllDepartments(),
    queryKey: [QUERY_KEYS.GET_ALL_DEPTS],
    refetchOnWindowFocus: false,
  });
};

export const useDeleteUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, authId }: { userId: string, authId: string }) => deleteUserById({ userId, authId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ALL_USERS],
      });
    },

  });
};

export const useUpdateUserById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id,
      name,
      departement,
      email,
      position,
      NIK,
      status,
      role
    }: {
      id: string,
      name: string,
      departement: string,
      email: string,
      position: string,
      NIK: number,
      status: string,
      role: string,
    }) => updateUserById({
      id,
      name,
      departement,
      email,
      position,
      NIK,
      status,
      role
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    },

  });
};


// export const useCreatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: INewPost) => createPost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

// export const useGetRecentPosts = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//     queryFn: () => getRecentPosts(),
//     refetchOnWindowFocus: false
//   });
// };

// export const useLikePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       postId,
//       likesArray,
//     }: {
//       postId: string;
//       likesArray: string[];
//     }) => likePost(postId, likesArray),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useSavePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
//       savePost(postId, userId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useDeleteSavedPost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ savedRecordId }: { savedRecordId: string }) =>
//       deleteSavedPost(savedRecordId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useGetPostById = (postId: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
//     queryFn: () => getPostById(postId),
//     enabled: !!postId,
//     refetchOnWindowFocus: false
//   });
// };

// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (post: IUpdatePost) => updatePost(post),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.id],
//       });
//     },
//   });
// };

// export const useDeletePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
//       deletePost(postId, imageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//     queryFn: ({ pageParam }) => getInfinitePosts({ pageParam }),
//     getNextPageParam: (lastPageArray) => {
//       if (!lastPageArray || lastPageArray.length === 0) return undefined;
//       const lastId = lastPageArray[lastPageArray.length - 1].createdAt;

//       return lastId;
//     },
//     initialPageParam: 0,
//   });
// };

// export const useSearchPost = (searchTerm: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
//     queryFn: () => searchPosts(searchTerm),
//     enabled: !!searchTerm,
//     refetchOnWindowFocus: false
//   });
// };
