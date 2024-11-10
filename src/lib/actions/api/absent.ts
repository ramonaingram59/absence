import { supabase } from "@/lib/supabase/connect";
import { formatDate, formatOnlyDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export const getHistoryRecord = async (
  userId?: string,
  range?: DateRange,
  limit?: number
) => {
  try {
    let query = supabase
      .from("AttendanceRecord")
      .select("*, Users(name, email, departement, position, role)");

    if (userId) {
      query = query.eq("userId", userId);
    }

    if (range) {
      query = query.gte("date", formatDate(range?.from!));
      query = query.lte("date", formatDate(range?.to!));
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: history, error } = await query.order("date", {
      ascending: false,
    });

    if (error) {
      console.error("Error showing attendance", error);
      return;
    }
    console.log(history, "history");
    return history;
  } catch (error) {
    console.log(error);
  }
};

export const addRecordAttendance = async (userId?: string, time?: Date) => {
  try {
    const END_SHIFT_HOUR = 17;
    const END_SHIFT_MINUTE = 30;

    if (!userId || !time) return false;
    const dateOnly = formatOnlyDate(time);

    // Cek absence today for this user
    const { data: existingRecords, error: fetchError } = await supabase
      .from("AttendanceRecord")
      .select("*")
      .eq("userId", userId)
      .eq("date", dateOnly)
      .order("createdAt", { ascending: true });

    if (fetchError) throw fetchError;

    if (existingRecords?.length == 0) {
      const { data, error } = await supabase
        .from("AttendanceRecord")
        .insert([
          {
            userId: userId,
            date: dateOnly,
            inTime: time.toUTCString(),
            status: "late",
          },
        ])
        .select();

      if (error) throw error;
      console.log("inTime record", data);
    } else {
      const lastRecord = existingRecords[existingRecords.length - 1];

      const currentHour = time.getHours();
      const currerntMinute = time.getMinutes();

      // Check if past 17:30, for outTime
      if (
        !lastRecord.outTime &&
        (currentHour > END_SHIFT_HOUR ||
          (currentHour >= END_SHIFT_HOUR && currerntMinute >= END_SHIFT_MINUTE))
      ) {
        const { data, error } = await supabase
          .from("AttendanceRecord")
          .update({
            outTime: time.toISOString(),
          })
          .eq("id", lastRecord.id);

        if (error) throw error;
        console.log("outTime record", data);
      }
    }

    console.log(existingRecords, "existingRecords Ok");

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
