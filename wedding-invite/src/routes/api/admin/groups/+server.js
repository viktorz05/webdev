import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

function generateToken() {
  // Generate a short, readable token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

async function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// GET all groups
export async function GET({ url }) {
  try {
    const supabase = await getSupabase();
    const token = url.searchParams.get('token');

    if (token) {
      // If a token is provided, return only that group (as an array for client compatibility)
      const { data, error } = await supabase
        .from('invitation_groups')
        .select('*')
        .eq('token', token)
        .limit(1);

      if (error) throw error;
      return json(data ? data : []);
    }

    const { data, error } = await supabase
      .from('invitation_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return json(data || []);
  } catch (e) {
    console.error('Error fetching groups:', e);
    return json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

// POST create new group
export async function POST({ request }) {
  try {
    const supabase = await getSupabase();
    const body = await request.json();
    
    if (!body.group_name?.trim()) {
      return json({ error: 'Group name is required' }, { status: 400 });
    }
    
    const token = generateToken();
    
    const { data, error } = await supabase
      .from('invitation_groups')
      .insert({
        token,
        group_name: body.group_name.trim(),
        group_type: body.group_type || 'family',
        suggested_guests: body.suggested_guests || 1,
        contact_person: body.contact_person?.trim() || null,
        notes: body.notes?.trim() || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return json(data);
  } catch (e) {
    console.error('Error creating group:', e);
    return json({ error: 'Failed to create group' }, { status: 500 });
  }
}
