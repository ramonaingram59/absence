import { supabase } from "@/lib/supabase/connect";
import { getUserById } from "./auth";

export const saveFaces = async ({ userId, descriptor }: { userId: string, descriptor: Float32Array }) => {
  try {
    const currentUser = await getUserById(userId)

    const jsonDescriptor = JSON.stringify(Array.from(descriptor));

    const { data: insertedSave, error } = await supabase
      .from("FaceData")
      .insert([
        {
          name: currentUser?.name!,
          descriptor: jsonDescriptor,
          userId: currentUser?.id
        },
      ])
      .select()

    console.log(insertedSave, 'insertedSave')

    if (error) throw Error

    return insertedSave
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};



export const allFaces = async () => {
  try {

    const { data: allFaces, error } = await supabase
      .from("FaceData")
      .select()

    console.log(allFaces, 'allFaces')

    if (error) throw Error

    return allFaces
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};