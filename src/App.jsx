import { useCallback, useState } from "react"
import InputPanel from "./components/InputPanel"
import SandboxRenderer from "./components/SandboxRenderer"
import { scanHtml } from "./utils/scanHtml"
import { explainAllWithAI } from "./utils/explainWithAI"

function App() {
  const [receivedHtml, setReceivedHtml] = useState('')
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [violations, setViolations] = useState([]);
  const [scanError, setScanError] = useState(null);
  const [explanations, setExplanations] = useState({});
  const [aiError, setAiError] = useState(null);

  function handleScan(html) {
    setReceivedHtml(html)
    setHasScanned(true)
    setIsScanning(true)
    setViolations([])
    setScanError(null)
    setExplanations({})
    setAiError(null)
  }


  const handleDocReady = useCallback(async (doc) => {
    const response = await scanHtml(doc);
    setViolations(response.violations)
    setScanError(response.error)

    if (response.violations.length > 0) {
      const uniqueViolations = Array.from(
        new Map(response.violations.map(v => [v.id, v])).values()
      );

      const result = await explainAllWithAI(uniqueViolations);
      setExplanations(result.explanations);
      setAiError(result.error);
    }

    setIsScanning(false)
  }, [])

  return (
    <div>
      <header>
        <h1>AccessiScan</h1>
        <p>Find accessibility problems and understand how to fix them.</p>
      </header>
      <main>

        <section>
          <h2>Your HTML</h2>
          <InputPanel onScan={handleScan} />
        </section>

        {receivedHtml && (<SandboxRenderer html={receivedHtml} onReady={handleDocReady} />)}

        <section>
          <h2>Result</h2>
          {!hasScanned && <p>Results will appear here after you scan</p>}
          {isScanning && <p>Scanning...</p>}
          {scanError && <p role="alert">{scanError}</p>}
          {aiError && <p role="alert">AI explanations unavailable: {aiError}</p>}
          {!isScanning && !scanError && hasScanned && violations.length === 0 && <p>No issues found</p>}
          {!isScanning && violations.length > 0 && (
            <ul>
              {violations.map((v) => {
                const ai = explanations[v.id];
                return (
                  <li key={v.id}>
                    <strong>{v.id}</strong> — {v.impact}
                    <p>{v.help}</p>
                    <code>{v.nodes[0]?.html}</code>

                    {ai && (
                      <div>
                        <p><strong>In simple words:</strong> {ai.explanation}</p>
                        <p><strong>Who it affects:</strong> {ai.whoItAffects}</p>
                        {ai.fixedCode && <pre>{ai.fixedCode}</pre>}
                        {ai.error && <p><em>{ai.error}</em></p>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

      </main>
    </div>
  )
}

export default App
