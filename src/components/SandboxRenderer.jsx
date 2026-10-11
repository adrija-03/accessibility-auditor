import { useEffect, useRef } from "react"
import axeScript from 'axe-core/axe.min.js?raw';
import DOMPurify from "dompurify";

function SandboxRenderer({ html, onReady }) {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (!html) return;

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const cleanHtml = DOMPurify.sanitize(html, {WHOLE_DOCUMENT: true})

        const htmlWithAxe = `
          ${cleanHtml}
          <script>${axeScript}</script>
        `;

        doc.open();
        doc.write(htmlWithAxe);
        doc.close();

        onReady(iframe); 
    }, [html]);

    return (
        <div>
            <iframe
                ref={iframeRef}
                title="HTML Preview"
                className='absolute left-[-9999px] w-250 h-200'></iframe>
        </div>
    )
}

export default SandboxRenderer