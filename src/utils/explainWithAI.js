export async function explainAllWithAI(violations) {
    try {
        // send only what the AI needs, keeps the request small
        const trimmed = violations.map((v) => ({
            id: v.id,
            help: v.help,
            description: v.description,
            html: v.nodes[0]?.html || 'not available',
        }));

        const response = await fetch('/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ violations: trimmed }),
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            throw new Error(errBody.error || `Request failed: ${response.status}`);
        }

        const explanations = await response.json();
        return { explanations, error: null };
    } catch (error) {
        console.error('AI explanation failed:', error);
        return { explanations: {}, error: error.message || 'AI explanations unavailable.' };
    }
}