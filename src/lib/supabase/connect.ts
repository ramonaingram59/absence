import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PROJECT_API_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
