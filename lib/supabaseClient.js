import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables.
// The public URL and anon key should be set via .env.local both
// locally and in your deployment platform (Vercel). These values
// are exposed to the browser, so never use your service role key here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
