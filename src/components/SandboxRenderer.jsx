import { useEffect, useRef } from "react"
import axeScript from 'axe-core/axe.min.js?raw';

function SandboxRenderer({ html, onReady }) {
    const iframeRef = useRef(null);

    // useEffect(() => {
    //     if (!html)
    //         return;

    //     const iframe = iframeRef.current;

    //     if (!iframe) return;

    //     const handleLoad = () => {
    //         onReady(iframe.contentDocument);

    //         iframe.onload = null;
    //     };

    //     iframe.onload = handleLoad;

    //     const doc = iframe.contentDocument;

    //     doc.open();
    //     doc.write(html);
    //     doc.close()

    //     return () => {
    //         iframe.onload = null;
    //     };

    // }, [html, onReady])

    useEffect(() => {
        if (!html) return;

        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const htmlWithAxe = `
          ${html}
          <script>${axeScript}</script>
        `;

        doc.open();
        doc.write(htmlWithAxe);
        doc.close();

        onReady(doc); // call once, right here — remove iframe.onload entirely
    }, [html]);

    return (
        <div>
            <iframe
                ref={iframeRef}
                title="HTML Preview"
                className='absolute -left-[9999px] w-[1000px] h-[800px]'></iframe>
        </div>
    )
}

export default SandboxRenderer