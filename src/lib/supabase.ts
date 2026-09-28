import { createClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

const supabaseUrl = env.supabaseUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = env.supabaseAnonKey || "placeholder-anon-key";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseClient() {
  return supabase;
}
