// Shared CORS headers for Astro edge functions. Allows the browser app
// (served from localhost or the production host) to call these endpoints.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};