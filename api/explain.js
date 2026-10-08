const MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash']; // fallback list
const MAX_RETRIES = 3;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGemini(prompt) {
    for (const model of MODELS) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: 'application/json' },
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) return data;

            const retryable = response.status === 503 || response.status === 429;
            // console.log(`${model} attempt ${attempt} failed: ${response.status}`);

            if (!retryable) {
                throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(data)}`);
            }

            await sleep(1000 * attempt); // wait 1s, 2s, 3s
        }
    }
    throw new Error('All models are busy. Try again in a minute.');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    try {
        const { violations } = req.body;

        if (!Array.isArray(violations) || violations.length === 0) {
            return res.status(400).json({ error: 'No violations provided' });
        }

        const prompt = `
You are an accessibility expert helping a junior developer.

Below is a list of accessibility violations found on a web page.
For EACH one, explain it in simple, plain English.

Violations:
${JSON.stringify(violations, null, 2)}

Respond with ONLY a JSON object, no extra text, no markdown fences.
The keys must be the "id" values from the list above, and each value must have this exact shape:
{
  "<id>": {
    "explanation": "why this is a problem, in simple words",
    "whoItAffects": "which users this affects",
    "fixedCode": "the corrected HTML snippet"
  }
}
`;

        const data = await callGemini(prompt);

        const rawText = data.candidates[0].content.parts[0].text;
        const cleanText = rawText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanText);

        return res.status(200).json(parsed);
    } catch (error) {
        console.error('AI call failed:', error.message);
        return res.status(500).json({ error: 'AI explanation failed' });
    }
}