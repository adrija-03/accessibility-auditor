// export async function scanHtml(doc) {

//     try {
//         const results = await axe.run(doc);
//         return {
//             violations: results.violations, error: null
//         };
//     } catch (error) {
//         console.error("axe-core scan failed:", error);
//         console.error("message:", error.message);
//         console.error("stack:", error.stack);
//         return {
//             violations: [], error: 'Something went wrong.'
//         };
//     } 
// }

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
        return { violations: results.violations, error: null };
    } catch (error) {
        console.error("axe-core scan failed:", error);
        return { violations: [], error: 'Something went wrong.' };
    }
}