import { useCallback, useState } from "react"
import InputPanel from "./components/InputPanel"
import SandboxRenderer from "./components/SandboxRenderer"
import { scanHtml } from "./utils/scanHtml"

function App() {
  const [receivedHtml, setReveivedHtml] = useState('')
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [violations, setViolations] = useState([]);
  const [scanError, setScanError] = useState(null);

  function handleScan(html) {
    setReveivedHtml(html)
    setHasScanned(true)
    setIsScanning(true)
    setViolations([])
    setScanError(null)
  }


  const handleDocReady = useCallback(async (doc) => {
    const response = await scanHtml(doc);
    setViolations(response.violations)
    setScanError(response.error)
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
          {!isScanning && !scanError && hasScanned && violations.length === 0 && <p>No issues found</p>}
          {!isScanning && violations.length > 0 && (
            <ul>
              {violations.map((v) => (
                <li key={v.id}>
                  <strong>{v.id}</strong> — {v.impact}
                  <p>{v.help}</p>
                  <code>{v.nodes[0]?.html}</code>
                </li>
              ))}
            </ul>
          )}
        </section>

      </main>
    </div>
  )
}

export default App
