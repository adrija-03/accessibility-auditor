import { useEffect, useRef } from "react"
import axeScript from 'axe-core/axe.min.js?raw';
import DOMPurify from "dompurify";

function SandboxRenderer({ html, onReady }) {
    const iframeRef = useRef(null);
    const onReadyRef = useRef(onReady);

    useEffect(() => {
        onReadyRef.current = onReady
    }, [onReady])

    useEffect(() => {
        if (!html) return;

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const cleanHtml = DOMPurify.sanitize(html, { WHOLE_DOCUMENT: true })

        const htmlWithAxe = `
          ${cleanHtml}
          <script>${axeScript}</script>
        `;

        doc.open();
        doc.write(htmlWithAxe);
        doc.close();

        onReadyRef.current(iframe)
    }, [html]);

    return (
        <div>
            <iframe
                ref={iframeRef}
                title="HTML Preview"
                tabIndex={-1}
                aria-hidden="true"
                sandbox="allow-same-origin allow-scripts"
                className='absolute left-[-9999px] w-250 h-200'
            />
        </div>
    )
}

export default SandboxRenderer