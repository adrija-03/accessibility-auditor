import { useState } from "react"
import InputPanel from "./components/InputPanel"

function App() {
  const [receivedHtml, setReveivedHtml] = useState('')
  const [scanned, setScanned] = useState(false)

  function handleScan(html) {
    setReveivedHtml(html)
    setScanned(true)
  }

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

        <section>
          <h2>Result</h2>
          {scanned ? <p>{receivedHtml}</p> : <p>Results will appear here after you scan</p>}
        </section>
      </main>
    </div>
  )
}

export default App
