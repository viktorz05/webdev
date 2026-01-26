import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export async function POST({ request }) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(`Missing Supabase credentials: url=${!!supabaseUrl}, key=${!!supabaseKey}`);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const data = await request.json();

    await supabase.from('tracks').insert({
      token: data.id || data.token || null,
      event: data.event || null,
      url: data.url || null,
      ts: data.ts || null
    });

    console.log('[/api/track] saved to supabase', { id: data.id, event: data.event });
    return json({ ok: true });
  } catch (e) {
    console.error('track error', e);
    return json({ ok: false, error: String(e) }, { status: 500 });
  }
}
