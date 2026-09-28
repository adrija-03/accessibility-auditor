import { useState } from 'react'
import { sampleHtml } from '../utils/sampleHtml'

function InputPanel({onScan}) {
    const [html, setHtml] = useState('')

    const isEmpty = html.trim() === '' 

    function handleScan() {
        onScan(html)
    }

    function handleSampleLoad() {
        setHtml(sampleHtml)
    }

    function handleClear() {
        setHtml('')
    }

    return (
        <div>
            <label htmlFor='html-input'>Paste your HTML here</label>
            <textarea
                id="html-input"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={14}
                placeholder="<img src='logo.png'>"
                spellCheck={false}
            />
            <p>
                Tip: paste a full page or just a section like a form or navbar.
            </p>
            <div>
                <button onClick={handleScan} disabled={isEmpty}>Scan</button>
                <button onClick={handleSampleLoad}>Load sample HTML</button>
                <button onClick={handleClear} disabled={isEmpty}>Clear</button>
            </div>

        </div>
    )
}

export default InputPanel