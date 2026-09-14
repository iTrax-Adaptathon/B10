/**
 * Supabase Configuration for PlanWise
 * Replace the placeholder values with your Supabase project URL and anon public key.
 * You can find these in your Supabase project settings -> API.
 */

export const SUPABASE_CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-public-key',
};

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_CONFIG.SUPABASE_URL) &&
    Boolean(SUPABASE_CONFIG.SUPABASE_ANON_KEY) &&
    !SUPABASE_CONFIG.SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_CONFIG.SUPABASE_ANON_KEY.includes('your-anon-public-key')
  );
};
