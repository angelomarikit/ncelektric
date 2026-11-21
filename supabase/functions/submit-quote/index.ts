import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': Deno.env.get('SITE_ORIGIN') || 'http://localhost:5173',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

function clean(value: unknown, max = 500): string {
  return String(value ?? '').trim().slice(0, max);
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function checkRateLimit(client: ReturnType<typeof createClient>, ip: string): Promise<boolean> {
  const ipHash = await hashIp(ip);
  const windowStart = new Date(Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS).toISOString();
  const { data } = await client
    .from('quote_rate_limits')
    .select('hit_count')
    .eq('ip_hash', ipHash)
    .eq('window_start', windowStart)
    .maybeSingle();

  if (!data) {
    await client.from('quote_rate_limits').insert({ ip_hash: ipHash, window_start: windowStart, hit_count: 1 });
    return true;
  }
  if (data.hit_count >= MAX_REQUESTS) return false;
  await client
    .from('quote_rate_limits')
    .update({ hit_count: data.hit_count + 1 })
    .eq('ip_hash', ipHash)
    .eq('window_start', windowStart);
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

  try {
    const b = await req.json();
    if (b.website) return new Response(JSON.stringify({ received: true, ignored: true }), { status: 202, headers: { ...cors, 'Content-Type': 'application/json' } });

    const email = clean(b.email, 254);
    const full_name = clean(b.full_name, 150);
    const product_name = clean(b.product_name, 250);
    const phone = clean(b.phone, 60);
    const quantity = clean(b.quantity, 30);

    if (!full_name || !/^\S+@\S+\.\S+$/.test(email) || !product_name) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (!phone) {
      return new Response(JSON.stringify({ error: 'phone_required' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (quantity && Number(quantity) < 1) {
      return new Response(JSON.stringify({ error: 'invalid_quantity' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const allowed = await checkRateLimit(client, forwarded);
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const productIdRaw = clean(b.product_id, 80);
    const product_id = productIdRaw && /^[0-9a-f-]{36}$/i.test(productIdRaw) ? productIdRaw : null;

    const payload = {
      full_name,
      email,
      product_name,
      product_id,
      company: clean(b.company, 150),
      phone,
      quantity: quantity || null,
      project_location: clean(b.project_location, 200),
      message: clean(b.message, 3000),
    };

    const { error } = await client.from('quotes').insert(payload);
    if (error) throw error;

    const key = Deno.env.get('RESEND_API_KEY');
    const recipient = Deno.env.get('OWNER_QUOTE_EMAIL');
    const sender = Deno.env.get('EMAIL_FROM');

    if (!key || !recipient || !sender) {
      return new Response(JSON.stringify({ received: true, email_not_configured: true }), {
        status: 202,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: 'New NC Elektric quotation request',
        text: Object.entries(payload)
          .map(([k, v]) => `${k}: ${v ?? ''}`)
          .join('\n'),
      }),
    });

    if (!res.ok) console.error('Email notification failed', res.status);

    return new Response(JSON.stringify({ received: true, email_sent: res.ok }), {
      status: 202,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'server_error' }), { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});