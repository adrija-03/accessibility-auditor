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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">AccessiScan</h1>
        <p className="text-gray-700">
          Find accessibility problems and understand how to fix them.
        </p>
      </header>
      <ThemeToggle/>

      <main>
        <section aria-labelledby="input-heading" className="mb-8">
          <h2 id="input-heading" className="mb-2 text-xl font-semibold">Your HTML</h2>
          <InputPanel onScan={handleScan} disabled={isScanning} />
        </section>

        {receivedHtml && (
          <SandboxRenderer key={scanId} html={receivedHtml} onReady={handleDocReady} />
        )}

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="mb-2 text-xl font-semibold">Results</h2>

          {!hasScanned && (
            <p>Results will appear here after you scan.</p>
          )}

          {isScanning && (
            <p role="status">
              {isFetching
                ? 'Fetching the page...'
                : aiEnabled ? 'Scanning and generating explanations...' : 'Scanning...'}
            </p>
          )}

          {scanError && (
            <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-900">
              {scanError}
            </p>
          )}

          {showResults && (
            <>

              {scanInfo && scanInfo.source !== 'Pasted HTML' && (
                <p className="mb-4 text-sm text-gray-700">
                  Note: URL scans analyze the page's raw HTML only. Content built by JavaScript is not
                  included, so scores for web apps can be too high.
                </p>
              )}
              <ScoreCard score={score} violations={violations} />

              {violations.length === 0 && (
                <p className="mt-4">No issues found. Nice work!</p>
              )}

              {aiError && (
                <p role="alert" className="my-4 rounded border border-amber-300 bg-amber-50 p-3 text-amber-900">
                  AI explanations are unavailable right now ({aiError}). The issues below
                  are still accurate.
                </p>
              )}

              {violations.length > 0 && (
                <ViolationsList violations={violations} explanations={explanations} aiEnabled={aiEnabled} />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )

}

export default App
