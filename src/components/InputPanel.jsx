import { useState } from 'react'
import { sampleHtml } from '../utils/sampleHtml'

function InputPanel({ onScan }) {
    const [html, setHtml] = useState('')
    const [isChecked, setIsChecked] = useState(false)

    const isEmpty = html.trim() === ''

    function handleScan() {
        onScan(html, isChecked)
    }

    function handleSampleLoad() {
        setHtml(sampleHtml)
    }

    function handleClear() {
        setHtml('')
    }

    function handleCheckboxChange(e) {
        setIsChecked(e.target.checked)
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
                <button onClick={handleScan} disabled={isEmpty} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer'>Scan</button>
                <button onClick={handleSampleLoad} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer'>Load sample HTML</button>
                <button onClick={handleClear} disabled={isEmpty} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded cursor-pointer'>Clear</button>
            </div>
            <div className="my-3">
                <label className="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        aria-describedby="ai-notice"
                        className="mt-1"
                    />
                    <span>Generate AI explanations</span>
                </label>
                <p id="ai-notice" className="ml-6 text-sm text-gray-700">
                    If checked, up to 3 broken HTML snippets per issue are sent to an AI service
                    (Google Gemini). If unchecked, scanning happens fully in your browser and
                    nothing is sent anywhere.
                </p>
            </div>
        </div>
    )
}

export default InputPanel