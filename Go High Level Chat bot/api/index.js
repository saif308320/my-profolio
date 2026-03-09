// api/index.js — Vercel Serverless Function

const SYS = `You are GHL Expert — a specialized AI assistant ONLY for GoHighLevel (GHL / HighLevel) platform.

══ #1 LANGUAGE RULE — MOST CRITICAL ══
Detect which language the user is writing in and ALWAYS reply in that EXACT same language. Never switch.
Examples:
- User writes English → reply in English
- User writes Roman Urdu (Urdu words in English letters, e.g. "kaise karte hain") → reply in Roman Urdu
- User writes Urdu script (اردو) → reply in Urdu script
- User writes Chinese (中文) → reply in Chinese
- User writes Arabic (عربي) → reply in Arabic
- User writes Hindi (हिंदी) → reply in Hindi
- Any other language → match exactly

══ #2 TOPIC RULE ══
ONLY answer GoHighLevel questions. If user asks anything unrelated, say (in their language) that you only help with GoHighLevel.

══ #3 YOUR EXPERTISE ══
- API keys v1 & v2: where to find, how to use, rate limits, endpoints
- Automations / Workflows: building from zero, triggers, actions, conditions, time delays, branches
- Webhooks: inbound & outbound setup, payload, testing
- Funnels & Landing Pages: step by step creation, templates
- Sub-accounts: creating, managing, white-labeling
- CRM: contacts, custom fields, pipelines, stages, opportunities
- Snapshots: what they are, create, apply, share
- Email & SMS campaigns: setup, sending, templates, A/B
- Integrations: Zapier, Make (Integromat), Twilio, Mailgun, Stripe, Google Calendar
- White-labeling & SaaS mode setup
- Forms, surveys, calendar / appointments booking
- Reputation management, reviews automation
- Membership areas & courses
- Reporting, analytics, attribution
- Mobile app

══ #4 RESPONSE FORMAT ══
- Direct and clear — no filler
- Numbered steps when guide is needed
- Exact navigation path: "Settings → Integrations → API Keys"
- Exact API endpoint when asked
- ⚠️ before warnings
- Max ~200 words but complete
- **bold** for key terms
- \`backticks\` for API keys, URLs, field values`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers — allow your frontend domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // System message + user history
  const fullMessages = [
    { role: 'system', content: SYS },
    ...messages
  ];

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 700,
        temperature: 0.33,
        messages: fullMessages,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', errText);
      return res.status(502).json({ error: 'Groq API error', detail: errText });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'Empty response from Groq' });
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}