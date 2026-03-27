// ══════════════════════════════════════════════
//  Nova AI — Backend Server (Node.js + Express)
//  API keys yahan safely rakho — frontend mein
//  kabhi nahi dikhenge
// ══════════════════════════════════════════════

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── API Keys — sirf yahan ──
const GROQ_API_KEY      = process.env.GROQ_API_KEY || 'apni_groq_api_key_yahan_likho';
const GROQ_MODEL        = 'llama-3.3-70b-versatile';
const GROQ_VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));  // HTML + CSS + JS serve karega

// ── Chat Route ──
// Frontend yahan POST karega — API key backend mein rahegi
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, useVision } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required hai' });
    }

    const model = useVision ? GROQ_VISION_MODEL : GROQ_MODEL;

    // Groq API call
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        max_tokens: 8192,
        messages
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({
        error: errData?.error?.message || `Groq API error: ${groqRes.status}`
      });
    }

    const data = await groqRes.json();
    return res.json(data);

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// ── Health Check ──
app.get('/api/health', (_, res) => res.json({ status: 'ok', message: 'Nova AI backend chal raha hai ✅' }));

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n🚀 Nova AI backend chal raha hai: http://localhost:${PORT}`);
  console.log(`   API keys safely backend mein hain — frontend mein nahi dikhenge\n`);
});