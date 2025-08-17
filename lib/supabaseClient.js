import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables.
// The public URL and anon key should be set via .env.local both
// locally and in your deployment platform (Vercel). These values
// are exposed to the browser, so never use your service role key here.
// You can configure Supabase via environment variables, but fall back to fixed values
// to ensure the app works even when the env vars are missing in production.
// DO NOT expose your service_role key here—only the public anon key.
// Provided by the user:
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://hkhmiqyoeikkjysqhyxq.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraG1pcXlvZWlra2p5c3FoeXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MjI3MjEsImV4cCI6MjA3MDk5ODcyMX0.A-fVJ1AWn8w1RXTHVkURaeH-CL7k9o7JY_w-msLLriQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
