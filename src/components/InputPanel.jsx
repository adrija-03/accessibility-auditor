import { useState } from 'react'
import { sampleHtml } from '../utils/sampleHtml'

function InputPanel({ onScan, disabled }) {
    const [mode, setMode] = useState('url') 
    const [html, setHtml] = useState('')
    const [url, setUrl] = useState('')
    const [wantsAI, setWantsAI] = useState(false)

    const value = mode === 'url' ? url : html
    const isEmpty = value.trim() === ''

    function handleScan() {
        onScan({ source: mode, value, wantsAI })
    }

    const primaryBtn =
        'rounded border border-blue-800 bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50'
    const secondaryBtn =
        'rounded border border-gray-500 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'

    return (
        <div>
            <div role="group" aria-label="Input type" className="mb-3 flex gap-2">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    aria-pressed={mode === 'url'}
                    className={mode === 'url' ? primaryBtn : secondaryBtn}
                >
                    Scan a URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode('html')}
                    aria-pressed={mode === 'html'}
                    className={mode === 'html' ? primaryBtn : secondaryBtn}
                >
                    Paste HTML
                </button>
            </div>

            {mode === 'url' ? (
                <div>
                    <label htmlFor="url-input" className="block font-medium">
                        Website address
                    </label>
                    <input
                        id="url-input"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full rounded border border-gray-400 p-2"
                        aria-describedby="url-note"
                    />
                    <p id="url-note" className="mt-1 text-sm text-gray-700">
                        Works best on static pages. Pages built with JavaScript, pages that need a
                        login, and sites that block bots may give incomplete results.
                    </p>
                </div>
            ) : (
                <div>
                    <label htmlFor="html-input" className="block font-medium">
                        Paste your HTML here
                    </label>
                    <textarea
                        id="html-input"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        rows={14}
                        maxLength={200000}
                        placeholder="<img src='logo.png'>"
                        spellCheck={false}
                        className="w-full rounded border border-gray-400 p-2 font-mono text-sm"
                    />
                </div>
            )}

            <div className="my-3 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={handleScan}
                    disabled={isEmpty || disabled}
                    className={primaryBtn}
                >
                    Scan
                </button>
                {mode === 'html' && (
                    <button type="button" onClick={() => setHtml(sampleHtml)} className={secondaryBtn}>
                        Load sample HTML
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => (mode === 'url' ? setUrl('') : setHtml(''))}
                    disabled={isEmpty}
                    className={secondaryBtn}
                >
                    Clear
                </button>
            </div>

            <div className="my-3">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={wantsAI}
                        onChange={(e) => setWantsAI(e.target.checked)}
                        aria-describedby="ai-notice"
                        className="mt-1"
                    />
                    <span>Generate AI explanations</span>
                </label>
                <p id="ai-notice" className="ml-6 text-sm text-gray-700">
                    If checked, up to 3 broken HTML snippets per issue are sent to an AI service
                    (Google Gemini). If unchecked, no scan data is sent to any AI service.
                </p>
            </div>
        </div>
    )
}

export default InputPanel