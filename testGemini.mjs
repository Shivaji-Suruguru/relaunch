import 'dotenv/config';
const k = process.env.GEMINI_API_KEY;
console.log('Key:', k ? k.substring(0, 15) + '...' : 'MISSING');
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k}`;
const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply only with: {"readinessScore":90}' }] }], generationConfig: { responseMimeType: 'application/json' } })
});
const d = await resp.json();
const raw = d?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
if (d?.error) {
    console.log('Gemini API error:', JSON.stringify(d.error));
} else {
    console.log('Gemini raw response:', raw);
}
