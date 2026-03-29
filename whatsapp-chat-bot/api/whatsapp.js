// ══════════════════════════════════════════════
//  Markonix WhatsApp AI Bot — Vercel Serverless
// ══════════════════════════════════════════════

const WHATSAPP_TOKEN  = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN    = process.env.VERIFY_TOKEN;
const GROQ_API_KEY    = process.env.GROQ_API_KEY;
const GROQ_MODEL      = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are "Markonix AI" — an intelligent WhatsApp assistant. Created by Saif.

RULES:
- Always reply in the same language the user writes in
- Be helpful, friendly and concise
- For long answers, use WhatsApp formatting: *bold*, _italic_, bullet points
- Keep replies short and to the point for WhatsApp`;

async function handleVerify(req, res) {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
}

async function sendMessage(to, text) {
  await fetch(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    })
  });
}

async function getAIReply(userMessage) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
}

export default async function handler(req, res) {
  if (req.method === 'GET')  return handleVerify(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') {
      return res.status(200).send('OK');
    }

    const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') {
      return res.status(200).send('OK');
    }

    const from    = message.from;
    const msgText = message.text.body;

    const reply = await getAIReply(msgText);
    await sendMessage(from, reply);

    return res.status(200).send('OK');

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}