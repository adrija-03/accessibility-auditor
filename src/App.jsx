import { useCallback, useState } from "react"
import InputPanel from "./components/InputPanel"
import SandboxRenderer from "./components/SandboxRenderer"
import { scanHtml } from "./utils/scanHtml"
import { explainAllWithAI } from "./utils/explainWithAI"
import { calculateScore } from "./utils/calculateScore"
import ScoreCard from "./components/ScoreCard"
import ViolationsList from "./components/ViolationsList"
import { fetchHtmlFromUrl } from "./utils/fetchHtmlFromUrl"
import ThemeToggle from "./components/ThemeToggle"

function App() {
  const [receivedHtml, setReceivedHtml] = useState('')
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [violations, setViolations] = useState([]);
  const [scanError, setScanError] = useState(null);
  const [scanId, setScanId] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const [scanInfo, setScanInfo] = useState(null)

  //for ai
  const [explanations, setExplanations] = useState({});
  const [aiError, setAiError] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(false);

  async function handleScan({ source, value, wantsAI }) {
    setHasScanned(true)
    setIsScanning(true)
    setViolations([])
    setExplanations({})
    setScanError(null)
    setAiError(null)
    setScanInfo(null)
    setAiEnabled(wantsAI)

    let html = value
    let sourceLabel = 'Pasted HTML'

    if (source === 'url') {
      try {
        setIsFetching(true)
        const data = await fetchHtmlFromUrl(value)
        html = data.html
        sourceLabel = data.finalUrl
      } catch (error) {
        setScanError(error.message)
        setIsScanning(false)
        return
      } finally {
        setIsFetching(false)
      }
    }

    setScanInfo({ source: sourceLabel })
    setReceivedHtml(html)
    setScanId((id) => id + 1)
  }

  const handleDocReady = useCallback(async (iframe) => {
    const response = await scanHtml(iframe)
    setViolations(response.violations)
    setScanError(response.error)
    setScanInfo((info) => ({
      ...info,
      title: iframe.contentDocument?.title || '(no title)',
      passesCount: response.passesCount,
      incompleteCount: response.incompleteCount,
    }))

    if (aiEnabled && response.violations.length > 0) {
      const result = await explainAllWithAI(response.violations)
      setExplanations(result.explanations)
      setAiError(result.error)
    }

    setIsScanning(false)
  }, [aiEnabled])

  const score = calculateScore(violations)
  const showResults = hasScanned && !isScanning && !scanError

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Top Header & Theme Toggle Bar */}
        <header className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              AccessiScan
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Find accessibility problems and understand how to fix them.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="space-y-8">
          {/* Input Section */}
          <section aria-labelledby="input-heading" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 id="input-heading" className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Your Input Source
            </h2>
            <InputPanel onScan={handleScan} disabled={isScanning} />
          </section>

          {receivedHtml && (
            <div>
              <SandboxRenderer key={scanId} html={receivedHtml} onReady={handleDocReady} />
            </div>
          )}

          {/* Results Section */}
          <section aria-labelledby="results-heading" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 id="results-heading" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Audit Results
              </h2>
            </div>

            {!hasScanned && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Results will appear here after you run a scan.
                </p>
              </div>
            )}

            {isScanning && (
              <div role="status" className="flex items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-300">
                <svg className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">
                  {isFetching
                    ? 'Fetching the page...'
                    : aiEnabled ? 'Scanning and generating explanations...' : 'Scanning...'}
                </span>
              </div>
            )}

            {scanError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {scanError}
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                {scanInfo && scanInfo.source !== 'Pasted HTML' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                    <span className="font-semibold">Note:</span> URL scans analyze the page's raw HTML only. Content built by JavaScript is not included, so scores for web apps can be too high.
                  </div>
                )}

                <ScoreCard score={score} violations={violations} />

                {violations.length === 0 && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <p className="font-semibold">No issues found. Nice work!</p>
                  </div>
                )}

                {aiError && (
                  <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                    AI explanations are unavailable right now ({aiError}). The issues below are still accurate.
                  </div>
                )}

                {violations.length > 0 && (
                  <ViolationsList violations={violations} explanations={explanations} aiEnabled={aiEnabled} />
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )

}

export default App
