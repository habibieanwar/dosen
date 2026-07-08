import { createClient } from "@supabase/supabase-js";

// Mengambil URL dan Anon Key dari env (Cybersecurity: tidak menaruh KUNCI mentah di dalam repositori kode)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl) {
  console.warn("Peringatan: VITE_SUPABASE_URL belum dikonfigurasi di file .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
