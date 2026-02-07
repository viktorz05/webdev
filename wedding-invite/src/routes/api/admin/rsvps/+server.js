import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    
    console.log('Checking credentials:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
    });
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all RSVPs with their check-in count
    const { data: rsvps, error: rsvpError } = await supabase
      .from('rsvps')
      .select('*');

    if (rsvpError) {
      console.error('RSVP fetch error:', rsvpError);
      throw rsvpError;
    }

    if (!rsvps) {
      console.log('No RSVPs found or null data returned');
      return json([]);
    }

    // For each RSVP, count how many tokens are checked in
    const rsvpsWithCheckIns = await Promise.all(
      rsvps.map(async (rsvp) => {
        const { count, error: countError } = await supabase
          .from('generated_tokens')
          .select('*', { count: 'exact' })
          .eq('rsvp_id', rsvp.id)
          .eq('checked_in', true);

        if (countError) {
          console.warn('Error counting check-ins for RSVP', rsvp.id, ':', countError);
          // Don't throw, just set count to 0
          return {
            ...rsvp,
            checked_in_count: 0
          };
        }

        return {
          ...rsvp,
          checked_in_count: count || 0
        };
      })
    );

    return json(rsvpsWithCheckIns);
  } catch (e) {
    console.error('admin/rsvps error', e);
    return json({ error: String(e), details: e.message }, { status: 500 });
  }
}
