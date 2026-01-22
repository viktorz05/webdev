import { json } from '@sveltejs/kit';
import archiver from 'archiver';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function pngBuffer(url) {
  return QRCode.toBuffer(url, { type: 'png', width: 400 });
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    const total = Number(body.guests || 1);

    // Insert RSVP record (let the DB set timestamps to avoid schema case issues)
    const { data: rsvpData, error: rsvpErr } = await supabase.from('rsvps').insert({
      name: body.name || null,
      attendance: body.attendance || null,
      song_request: body.song_request || null,
      message: body.message || null,
      token_base: body.id || null,
      guests: total
    }).select().single();

    if (rsvpErr) throw rsvpErr;
    const rsvpId = rsvpData.id;

    // Build items for QR generation and persist generated tokens in batch
    const items = [];
    const tokensToInsert = [];
    const baseId = body.id || `guest-${rsvpId}`;
    for (let i = 0; i < total; i++) {
      const token = `${baseId}-${i + 1}`;
      const url = `${process.env.BASE_ORIGIN || 'http://localhost:5173'}/rsvp?id=${encodeURIComponent(token)}`;
      const label = `${(body.name || 'guest')}-${i + 1}`;
      tokensToInsert.push({ token, rsvp_id: rsvpId, label });
      items.push({ id: token, label, url });
    }

    if (tokensToInsert.length) {
      const { error: tokenErr } = await supabase.from('generated_tokens').insert(tokensToInsert);
      if (tokenErr) throw tokenErr;
    }

    // Create ZIP archive stream
    const archive = archiver('zip', { zlib: { level: 9 } });
    for (const it of items) {
      const buf = await pngBuffer(it.url);
      archive.append(buf, { name: `${it.label}.png` });
    }
    archive.finalize();

    return new Response(archive, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${(body.name || 'rsvp').replace(/\s+/g, '_')}_qrcodes.zip"`
      }
    });
  } catch (e) {
    console.error('rsvp error', e);
    return json({ ok: false, error: String(e) }, { status: 500 });
  }
}
