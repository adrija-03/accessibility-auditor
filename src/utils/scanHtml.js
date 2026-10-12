export async function scanHtml(iframe) {

    try {
        if (!iframe || !iframe.contentWindow) {
            return { violations: [], error: 'Preview frame is not ready yet.' };
        }

        const axeInFrame = iframe.contentWindow.axe;

        if (!axeInFrame) {
            return { violations: [], error: 'Accessibility engine did not load. Try scanning again.' };
        }

        const results = await axeInFrame.run(iframe.contentDocument);

        const severityOrder = {
            critical: 1,
            serious: 2,
            moderate: 3,
            minor: 4
        }

        const sortedViolations = [...results.violations].sort(
            (a, b) => severityOrder[a.impact] - severityOrder[b.impact]
        );

        return {
            violations: sortedViolations,
            passesCount: results.passes.length,
            incompleteCount: results.incomplete.length,
            error: null,
        };
    } catch (error) {
        console.error("axe-core scan failed:", error);
        return {
            violations: [],
            passesCount: 0,
            incompleteCount: 0,
            error: 'Something went wrong.'
        };
    }
}