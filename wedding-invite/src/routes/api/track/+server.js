import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST({ request }) {
  try {
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
