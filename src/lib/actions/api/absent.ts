import { supabase } from "@/lib/supabase/connect";
import { formatDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export const getHistoryRecord = async (userId?: string, range?: DateRange) => {
  try {
    let query = supabase.from("AttendanceRecord").select("*");

    if (userId) {
      query = query.eq("userId", userId);
    }

    if (range) {
      query = query.gte("date", formatDate(range?.from!));
      query = query.lte("date", formatDate(range?.to!));
    }

    const { data: history, error } = await query.order("date", {
      ascending: false,
    });

    if (error) {
      console.error("Error showing attendance", error);
      return;
    }

    return history;
  } catch (error) {
    console.log(error);
  }
};
