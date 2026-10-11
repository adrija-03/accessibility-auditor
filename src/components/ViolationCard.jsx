import { useState } from "react"

const SEVERITY_STYLES = {
  critical: 'bg-red-100 text-red-900 border-red-300',
  serious: 'bg-orange-100 text-orange-900 border-orange-300',
  moderate: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  minor: 'bg-blue-100 text-blue-900 border-blue-300',
}

const MAX_SNIPPETS = 3

function ViolationCard({ violation, explanation, aiEnabled }) {
  const [copied, setCopied] = useState(false);

  const severityStyle = SEVERITY_STYLES[violation.impact] ?? SEVERITY_STYLES.minor;
  const nodeCount = violation.nodes.length;
  const shownNodes = violation.nodes.slice(0, MAX_SNIPPETS);
  const hiddenCount = nodeCount - shownNodes.length;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(explanation.fixedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed: ', error)
    }
  }

  return (
    <article className="rounded-lg border border-gray-300 p-4">
      <header className="mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{violation.help}</h3>
          <span className={`rounded border px-2 py-0.5 text-sm font-medium ${severityStyle}`}>
            {violation.impact}
          </span>
        </div>
        <p className="text-sm text-gray-700">Rule: {violation.id}</p>
      </header>

      <p className="mb-3">{violation.description}</p>

      <p className="mb-3 text-sm font-medium">
        {nodeCount} {nodeCount === 1 ? 'element' : 'elements'} affected
      </p>

      <section className="mb-4">
        <h4 className="font-medium">Broken element{nodeCount > 1 ? 's' : ''}</h4>
        {shownNodes.map((node, index) => (
          <pre key={index} className="my-1 overflow-x-auto rounded bg-gray-100 p-2 text-sm">
            <code>{node.html}</code>
          </pre>
        ))}
        {hiddenCount > 0 && (
          <p className="text-sm text-gray-700">+ {hiddenCount} more</p>
        )}
      </section>

      {explanation ? (
        <section className="mb-4 rounded bg-gray-50 p-3">
          <h4 className="font-medium">In simple words</h4>
          <p className="mb-2">{explanation.explanation}</p>

          <h4 className="font-medium">Who it affects</h4>
          <p className="mb-2">{explanation.whoItAffects}</p>

          {explanation.fixedCode && (
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Suggested fix</h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded border border-gray-400 px-2 py-1 text-sm hover:bg-gray-200"
                >
                  <span aria-live="polite">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="my-1 overflow-x-auto rounded bg-gray-100 p-2 text-sm">
                <code>{explanation.fixedCode}</code>
              </pre>
              <p className="text-sm text-gray-700">AI-suggested fix. Review before using.</p>
            </>
          )}
        </section>
      ) : (
        <p className="mb-4 text-sm italic text-gray-700">
          {aiEnabled
            ? 'AI explanation unavailable.'
            : 'AI explanations are off. Tick "Generate AI explanations" and scan again to get plain-English fixes.'}
        </p>
      )}

      <a
        href={violation.helpUrl}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-800 underline"
      >
        Learn more about this rule
      </a>
    </article>
  )
}

export default ViolationCard