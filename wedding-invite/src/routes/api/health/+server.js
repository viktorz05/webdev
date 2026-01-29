import { json } from '@sveltejs/kit';

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  
  return json({
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlPreview: supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : 'MISSING',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}
