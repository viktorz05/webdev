import QRCode from 'qrcode';
import archiver from 'archiver';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

// Helper: generate PNG buffer for a given URL
async function pngForUrl(url) {
  return QRCode.toBuffer(url, { type: 'png', width: 400 });
}

// POST { items: [{ id, label, url }] }
// Returns a ZIP attachment of PNGs named by label/id
export async function POST({ request }) {
  try {
    const payload = await request.json();
    const items = payload.items || [];

    // Create a PassThrough by using Node streams via Response streaming
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Build entries
    for (const it of items) {
      const url = it.url;
      const name = `${it.label || it.id}.png`;
      const buf = await pngForUrl(url);
      archive.append(buf, { name });
    }

    archive.finalize();

    return new Response(archive, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="qrcodes.zip"`
      }
    });
  } catch (e) {
    console.error('qr zip error', e);
    return json({ ok: false, error: String(e) }, { status: 500 });
  }
}
