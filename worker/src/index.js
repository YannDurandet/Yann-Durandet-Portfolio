/**
 * durandet.studio — Cloudflare Worker API
 *
 * Endpoints
 * POST /api/subscribe  { email: string }
 *   → validates email
 *   → inserts into Turso subscribers table
 *   → sends welcome email via Resend
 *   → returns 200 JSON
 *
 * Secrets required (set with `wrangler secret put <NAME>`):
 *   TURSO_URL, TURSO_AUTH_TOKEN, RESEND_API_KEY
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  'https://durandet.studio',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      return handleSubscribe(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

/* ── Subscribe handler ───────────────────────────────────────────── */

async function handleSubscribe(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON', 400);
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) {
    return jsonError('Invalid email address', 400);
  }

  // Insert into Turso
  const dbResult = await tursoQuery(env, {
    sql: 'INSERT OR IGNORE INTO subscribers (email) VALUES (?)',
    args: [email],
  });

  if (dbResult.error) {
    console.error('Turso error:', dbResult.error);
    return jsonError('Database error', 500);
  }

  const isNew = dbResult.rows_affected > 0;

  // Send welcome email only for new subscribers
  if (isNew) {
    await sendWelcomeEmail(env, email);
  }

  return jsonOk({ message: isNew ? 'subscribed' : 'already_subscribed' });
}

/* ── Turso client ────────────────────────────────────────────────── */

async function tursoQuery(env, { sql, args = [] }) {
  const res = await fetch(`${env.TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql, args: args.map(valueToTurso) } }],
    }),
  });

  if (!res.ok) {
    return { error: `Turso HTTP ${res.status}` };
  }

  const data = await res.json();
  const result = data.results?.[0];
  if (result?.type === 'error') {
    return { error: result.error?.message || 'Unknown Turso error' };
  }

  return { rows_affected: result?.response?.result?.rows_affected ?? 0 };
}

function valueToTurso(v) {
  if (v === null) return { type: 'null' };
  if (typeof v === 'number') return { type: 'integer', value: String(v) };
  return { type: 'text', value: String(v) };
}

/* ── Resend client ───────────────────────────────────────────────── */

async function sendWelcomeEmail(env, to) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Yann Durandet <hello@durandet.studio>',
      to: [to],
      subject: 'You\'re on the list.',
      html: `
        <p style="font-family:Georgia,serif;font-size:18px;font-style:italic;color:#212622;">
          Thanks for signing up.
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:15px;color:#4E5E4E;line-height:1.6;">
          I'll reach out when there's something worth sharing — new projects, thoughts on design,
          or the occasional open availability notice.<br><br>
          — Yann
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:12px;color:#9aab9a;">
          You can unsubscribe any time by replying "unsubscribe".
        </p>
      `,
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', await res.text());
  }
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonOk(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
