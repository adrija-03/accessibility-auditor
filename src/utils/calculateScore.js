const PENALTIES = {
    critical: 10,
    serious: 7,
    moderate: 4,
    minor: 1,
};

export function calculateScore(violations) {
    const totalPenalty = violations.reduce((sum, v) => {
        return sum + (PENALTIES[v.impact] ?? 0);
    }, 0);

    return Math.max(0, 100 - totalPenalty);
}