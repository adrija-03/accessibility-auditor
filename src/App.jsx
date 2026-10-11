import { useCallback, useState } from "react"
import InputPanel from "./components/InputPanel"
import SandboxRenderer from "./components/SandboxRenderer"
import { scanHtml } from "./utils/scanHtml"
import { explainAllWithAI } from "./utils/explainWithAI"
import { calculateScore } from "./utils/calculateScore"
import ScoreCard from "./components/ScoreCard"
import ViolationsList from "./components/ViolationsList"

function App() {
  const [receivedHtml, setReceivedHtml] = useState('')
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [violations, setViolations] = useState([]);
  const [scanError, setScanError] = useState(null);

  //for ai
  const [explanations, setExplanations] = useState({});
  const [aiError, setAiError] = useState(null);

  function handleScan(html) {
    setReceivedHtml(html)
    setHasScanned(true)
    setIsScanning(true)
    setViolations([])
    setScanError(null)

    //for ai
    setExplanations({})
    setAiError(null)
  }

  //for ai
  const handleDocReady = useCallback(async (iframe) => {

    const response = await scanHtml(iframe);
    setViolations(response.violations)
    setScanError(response.error)

    if (response.violations.length > 0) {
      const result = await explainAllWithAI(response.violations);
      setExplanations(result.explanations);
      setAiError(result.error);
    }

    setIsScanning(false)
  }, [])

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

      <main>
        <section aria-labelledby="input-heading" className="mb-8">
          <h2 id="input-heading" className="mb-2 text-xl font-semibold">Your HTML</h2>
          <InputPanel onScan={handleScan} />
        </section>

        {receivedHtml && (
          <SandboxRenderer html={receivedHtml} onReady={handleDocReady} />
        )}

        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="mb-2 text-xl font-semibold">Results</h2>

          {!hasScanned && (
            <p>Results will appear here after you scan.</p>
          )}

          {isScanning && (
            <p role="status">Scanning and generating explanations...</p>
          )}

          {scanError && (
            <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-900">
              {scanError}
            </p>
          )}

          {showResults && (
            <>
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
                <ViolationsList violations={violations} explanations={explanations} />
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )

  //for without ai
  // const handleDocReady = useCallback(async (doc) => {
  //   const response = await scanHtml(doc);
  //   // const score = calculateScore(response.violations)
  //   // console.log(score)
  //   setViolations(response.violations)
  //   setScanError(response.error)
  //   setIsScanning(false)
  // }, [])

  // const score = calculateScore(violations)
  // const showResults = hasScanned && !isScanning && !scanError
  // return (
  //   <div>
  //     <header>
  //       <h1>AccessiScan</h1>
  //       <p>Find accessibility problems and understand how to fix them.</p>
  //     </header>
  //     <main>

  //       <section>
  //         <h2>Your HTML</h2>
  //         <InputPanel onScan={handleScan} />
  //       </section>

  //       {receivedHtml && (<SandboxRenderer html={receivedHtml} onReady={handleDocReady} />)}

  //       <section>
  //         <h2>Result</h2>
  //         {!hasScanned && <p>Results will appear here after you scan</p>}
  //         {isScanning && <p>Scanning...</p>}
  //         {scanError && <p role="alert">{scanError}</p>}
  //         {!isScanning && !scanError && hasScanned && violations.length === 0 && <p>No issues found</p>}
  //         {!isScanning && violations.length > 0 && (
  //           <ul>
  //             {violations.map((v) => (
  //               <li key={v.id}>
  //                 <strong>{v.id}</strong> — {v.impact}
  //                 <p>{v.help}</p>
  //                 <code>{v.nodes[0]?.html}</code>
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //         {showResults && <ScoreCard score={score}/>}
  //         {violations.length > 0 && <ViolationsList violations= {violations}/>}
  //       </section>



  //     </main>
  //   </div>
  // )
}

export default App
