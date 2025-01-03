import { getAccount } from "../actions/api/auth";
import { supabase } from "../supabase/connect";

export const uploadFile = async (file: File) => {
  try {
    const currentAccount = await getAccount();

    const { data: uploadedFile } = await supabase.storage
      .from("media")
      .upload(
        `public/media_${currentAccount?.data.session?.user.email}${Date.now()}`,
        file
      );

    console.log(uploadedFile, " uploadedFile");

    return uploadedFile;
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};

export const getFilePreview = async (fileId: string) => {
  try {
    // Using Appwrite
    // const fileUrl = storage.getFilePreview(
    //   appwriteConfig.storageId,
    //   fileId,
    //   2000,
    //   2000,
    //   ImageGravity.Top,
    //   100,
    // )

    // if (!fileUrl) throw Error

    // const { data } = await supabase.storage.from("media").;

    const { data } = await supabase.storage.from("media").list("");

    const res = data?.find((item) => item.id == fileId);

    let fileUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_MEDIA_URL}/${res?.name
      }`;

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};

// export const deleteFile = async (fileName: string) => {
//   try {
//     // await storage.deleteFile(appwriteConfig.storageId, fileId);

//     const { data } = await supabase.storage.from("media").remove([fileName]);

//     return data;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const createPost = async (post: INewPost) => {
//   try {
//     const { userId, caption, location, file } = post;

//     const uploadedFile = await uploadFile(file[0]);

//     if (!uploadedFile) throw Error;

//     let fileUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_MEDIA_URL}/${uploadedFile.fullPath
//       }`;

//     const tags = post?.tags?.split(" ") || [];

//     const { data: newPost, error } = await supabase
//       .from("Posts")
//       .insert([
//         {
//           creator: userId,
//           imageId: uploadedFile.id,
//           imageUrl: fileUrl,
//           caption,
//           location,
//           tags,

//         },
//       ])
//       .select();

//     if (error) {
//       console.error("Error saving user to DB:", error);
//       return;
//     }

//     if (!newPost) {
//       await deleteFile(uploadedFile.path);
//       throw Error;
//     }

//     return newPost;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const getRecentPosts = async () => {
//   try {
//     // const posts = await databases.listDocuments(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   [Query.orderDesc("$createdAt"), Query.limit(20)]
//     // );

//     const { data: posts, error } = await supabase
//       .from("Posts")
//       .select("*, creator(*)")
//       .order("createdAt", {
//         ascending: false,
//       })
//       .limit(20)
//       .returns<PostWithUser[]>();

//     console.log(posts, "posts");
//     if (error) console.log(error, "errordd");

//     return posts;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const likePost = async (postId: string, likesArray: string[]) => {
//   try {
//     // const updatedPost = await databases.updateDocument(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   postId,
//     //   {
//     //     likes: likesArray,
//     //   }
//     // );

//     const { data: updatedPost, error } = await supabase
//       .from("Posts")
//       .update({
//         likedBy: likesArray,
//       })
//       .eq("id", postId)
//       .returns<PostWithUser>()

//     const currentUser = await getCurrentUser();

//     let liked = currentUser?.liked || [];
//     let newLiked = [...liked];

//     let isAlreadyLiked = newLiked.includes(postId);

//     if (isAlreadyLiked) {
//       newLiked = newLiked.filter((id) => id !== postId);
//     } else {
//       newLiked.push(postId);
//     }

//     const { data: updatedUser, error: error2nd } = await supabase
//       .from("Users")
//       .update({
//         liked: newLiked,
//       })
//       .eq("id", currentUser?.id!);

//     if (error || error2nd || !updatedUser) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const savePost = async (postId: string, userId: string) => {
//   try {
//     // const updatedPost = await databases.createDocument(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.saveCollectionId,
//     //   ID.unique(),
//     //   {
//     //     user: userId,
//     //     post: postId,
//     //   }
//     // );
//     const currentUser = await getCurrentUser();



//     const { data: insertedSave, error } = await supabase
//       .from("Saves")
//       .insert([
//         {
//           post: postId,
//           user: userId,
//         },
//       ])
//       .select()
//       .returns<Save[]>()

//     console.log(insertedSave, 'insertedSave')

//     if (insertedSave && insertedSave.length > 0) {
//       const insertedSaveId = insertedSave[0].id

//       let saved = currentUser?.save || [];
//       let newSaved = [...saved];

//       let isAlreadyLiked = newSaved.includes(insertedSaveId);

//       if (isAlreadyLiked) {
//         newSaved = newSaved.filter((id) => id !== insertedSaveId);
//       } else {
//         newSaved.push(insertedSaveId);
//       }

//       const { data: updatedPost } = await supabase.from("Users")
//         .update({
//           save: newSaved
//         })
//         .eq("id", currentUser?.id!)
//         .returns<PostWithUser>()

//       if (error) throw Error;

//       return updatedPost;
//     }

//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const deleteSavedPost = async (saveRecordId: string) => {
//   try {
//     // const updatedPost = await databases.deleteDocument(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.saveCollectionId,
//     //   saveRecordId
//     // );

//     const { data: updatedPost, error } = await supabase
//       .from("Saves")
//       .delete()
//       .eq("id", saveRecordId);

//     if (error) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const getPostById = async (postId: string) => {
//   try {
//     // const post = await databases.getDocument(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   postId
//     // );

//     const { data: post, error } = await supabase
//       .from("Posts")
//       .select("*")
//       .eq("id", postId)
//       .single<PostWithUser>();

//     if (error) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const updatePost = async (post: IUpdatePost) => {
//   const hasFile = post.file.length > 0;

//   try {
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };

//     if (hasFile) {
//       const uploadedFile = await uploadFile(post.file[0]);
//       if (!uploadedFile) throw Error;

//       // const fileUrl = await getFilePreview(uploadedFile.id);
//       // if (!fileUrl) {
//       //   await deleteFile(uploadedFile.path);
//       //   throw Error;
//       // }

//       let fileUrl = `${import.meta.env.VITE_SUPABASE_STORAGE_MEDIA_URL}/${uploadedFile.fullPath
//         }`;

//       console.log(fileUrl, "udpatefileUrl");

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.id };
//     }

//     const tags = post?.tags?.split(" ") || [];

//     // const updatePost = await databases.updateDocument(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   post.postId,
//     //   {
//     //     caption: post.caption,
//     //     location: post.location,
//     //     tags: tags,
//     //     imageUrl: image.imageUrl,
//     //     imageId: image.imageId,
//     //   }
//     // );

//     const { data: updatePost, error } = await supabase
//       .from("Posts")
//       .update({
//         caption: post.caption,
//         location: post.location,
//         tags,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//       })
//       .eq("id", post.postId)
//       .select()
//       .returns<PostWithUser>();

//     if (error) {
//       await deleteFile(post.imageId);
//       throw Error;
//     }

//     return updatePost;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const deletePost = async (postId: string, imageId: string) => {
//   if (!postId || !imageId) throw Error;

//   try {
//     await databases.deleteDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       postId
//     );

//     return { status: 200 };
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const getInfinitePosts = async ({
//   pageParam,
// }: {
//   pageParam: string | number;
// }) => {
//   // const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];

//   // if (pageParam) {
//   //   queries.push(Query.cursorAfter(pageParam.toString()));
//   // }

//   try {
//     // const posts = await databases.listDocuments(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   queries
//     // );

//     let query = supabase
//       .from("Posts")
//       .select("*, creator(*)")
//       .order("createdAt", {
//         ascending: false,
//       })
//       .limit(3);

//     // if (pageParam) {
//     //   let toPages = +pageParam + 2;
//     //   query = query.range(+pageParam, toPages);
//     // }
//     // Apply cursor-based pagination if pageParam is provided
//     if (pageParam) {
//       query = query.lt("createdAt", pageParam); // Fetch records before the cursor
//     }

//     const { data: posts, error } = await query.returns<PostWithUser[]>();

//     if (error) throw Error;

//     return posts;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

// export const searchPosts = async (searchTerm: string) => {
//   try {
//     // const posts = await databases.listDocuments(
//     //   appwriteConfig.databaseId,
//     //   appwriteConfig.postCollectionId,
//     //   [Query.search("caption", searchTerm)]
//     // );

//     const { data: posts, error } = await supabase
//       .from("Posts")
//       .select("*, creator(*)")
//       .eq("caption", searchTerm)
//       .returns<PostWithUser[]>();

//     if (error) throw Error;

//     return posts;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Error: ${error}`);
//   }
// };

