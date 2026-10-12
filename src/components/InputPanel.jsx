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
        'rounded-lg border border-transparent bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900'

    const secondaryBtn =
        'rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900'

    return (
        <div className="space-y-4 text-gray-900 dark:text-gray-100">
            <div role="group" aria-label="Input type" className="flex gap-2">
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
                <div className="space-y-1.5">
                    <label htmlFor="url-input" className="block text-sm font-medium">
                        Website address
                    </label>
                    <input
                        id="url-input"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        aria-describedby="url-note"
                    />
                    <p id="url-note" className="text-xs text-gray-600 dark:text-gray-400">
                        Works best on static pages. Pages built with JavaScript, pages that need a
                        login, and sites that block bots may give incomplete results.
                    </p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <label htmlFor="html-input" className="block text-sm font-medium">
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
                        className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    />
                </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
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

            <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={wantsAI}
                        onChange={(e) => setWantsAI(e.target.checked)}
                        aria-describedby="ai-notice"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                    />
                    <span className="text-sm font-medium">Generate AI explanations</span>
                </label>
                <p id="ai-notice" className="ml-7 mt-1 text-xs text-gray-600 dark:text-gray-400">
                    If checked, up to 3 broken HTML snippets per issue are sent to an AI service
                    (Google Gemini). If unchecked, no scan data is sent to any AI service.
                </p>
            </div>
        </div>
    )
}

export default InputPanel