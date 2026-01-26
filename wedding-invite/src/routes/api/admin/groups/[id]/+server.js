import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

async function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// DELETE a group
export async function DELETE({ params }) {
  try {
    const supabase = await getSupabase();
    const id = Number(params.id);
    
    if (isNaN(id)) {
      return json({ error: 'Invalid group ID' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('invitation_groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return json({ success: true });
  } catch (e) {
    console.error('Error deleting group:', e);
    return json({ error: 'Failed to delete group' }, { status: 500 });
  }
}
