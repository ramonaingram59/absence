import { supabase } from "@/lib/supabase/connect";

export const getHistoryRecord = async (userId?: string) => {
  try {
    let query = supabase
      .from("AttendanceRecord")
      .select("*")

    if (userId) {
      query = query.eq("userId", userId);
    }

    const { data: history, error } = await query

    if (error) {
      console.error("Error showing attendance", error);
      return;
    }

    return history;
  } catch (error) {
    console.log(error);
  }
};