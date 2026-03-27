// background.js - service worker
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'generateScript') {
    chrome.storage.local.get(['openaiKey'], async ({ openaiKey }) => {
      if (!openaiKey) return sendResponse({ error: 'No OpenAI key' });

      const prompt = `You are a world-class YouTube news narrator. Rewrite the following news article into an ORIGINAL, engaging 8–12 minute spoken script for a faceless YouTube channel.
Rules: Start with a powerful hook in first 5s. Conversational, energetic. 3–4 rhetorical questions. Natural pauses. End with CTA: Comment, like, subscribe. 100% original. Tone: exciting/professional. 1200–1600 words.
Trend: ${msg.title}
Article: ${msg.articleText}`;

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await res.json();
        sendResponse({ script: data.choices[0].message.content });
      } catch (e) {
        sendResponse({ error: e.message });
      }
    });
    return true; // async response
  }

  if (msg.action === 'getPexels') {
    chrome.storage.local.get(['pexelsKey'], async ({ pexelsKey }) => {
      if (!pexelsKey) return sendResponse({ error: 'No Pexels key' });
      try {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(msg.query)}&per_page=5`, {
          headers: { 'Authorization': pexelsKey }
        });
        const data = await res.json();
        sendResponse({ photos: data.photos.map(p => p.src.medium) });
      } catch (e) {
        sendResponse({ error: e.message });
      }
    });
    return true;
  }

  if (msg.action === 'speak') {
    chrome.tts.speak(msg.text, { rate: 1.0, pitch: 1.0 });
    sendResponse({ done: true });
  }
});
