import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export async function POST({ request }) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { token } = await request.json();

    if (!token) {
      return json({ ok: false, error: 'Token is required' }, { status: 400 });
    }

    // Mark token as checked in
    const { error: updateErr } = await supabase
      .from('generated_tokens')
      .update({ checked_in: true, checked_in_at: new Date().toISOString() })
      .eq('token', token);

    if (updateErr) throw updateErr;

    // Get the associated RSVP info
    const { data: tokenData, error: tokenErr } = await supabase
      .from('generated_tokens')
      .select('label, rsvp_id')
      .eq('token', token)
      .single();

    if (tokenErr) throw tokenErr;

    return json({ 
      ok: true, 
      message: `${tokenData.label} checked in!`,
      label: tokenData.label 
    });
  } catch (e) {
    console.error('checkin error', e);
    return json({ ok: false, error: String(e) }, { status: 500 });
  }
}
