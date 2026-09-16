import { createClient } from '@supabase/supabase-js';

// The publishable key is intentionally usable in client apps. RLS remains the security boundary.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://cjywdvaitaasxtmgpwas.supabase.co';
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Zz3-F6wTEyzViX1CAuktZQ_0wH9yLOV';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
