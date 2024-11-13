import { supabase } from "../../supabase/connect";

export const recordUnknownFaces = async ({
  descriptor,
  faceImage,
  timestamp
}: {
  faceImage: string,
  timestamp: Date,
  descriptor: Float32Array
}) => {
  try {

    const jsonDescriptor = JSON.stringify(Array.from(descriptor));

    const { data: insertedSave, error } = await supabase
      .from("UnknownFaceRecord")
      .insert([
        {
          faceDescriptor: jsonDescriptor,
          faceImage: faceImage,
          notes: '',
          timestamp: timestamp.toUTCString()
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



export const allUnknownFaces = async () => {
  try {

    const { data: allUnknownFaces, error } = await supabase
      .from("UnknownFaceRecord")
      .select()

    if (error) throw Error

    return allUnknownFaces
  } catch (error) {
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
};


export const deleteUnknownFace = async ({ id }: { id: string }) => {
  try {

    if (!id) return null

    let { error, data: userData } = await supabase
      .from("UnknownFaceRecord")
      .delete()
      .eq("id", id)

    if (!userData || error) throw Error;

    return userData[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};