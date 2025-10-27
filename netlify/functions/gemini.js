// Netlify function to proxy requests to Google Generative Language (Gemini)
// Reads GEMINI_API_KEY from process.env
exports.handler = async (event) => {
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const input = body.input || '';
        if (!input) return { statusCode: 400, body: JSON.stringify({ error: 'Missing input' }) };

        const key = process.env.GEMINI_API_KEY;
        if (!key) return { statusCode: 500, body: JSON.stringify({ error: 'Server API key not configured' }) };

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
        });

        const data = await res.json();
        // Try to extract reply text conservatively
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        return { statusCode: 200, body: JSON.stringify({ reply, raw: data }) };
    } catch (err) {
        console.error('Gemini proxy error:', err);
        return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
    }
};
