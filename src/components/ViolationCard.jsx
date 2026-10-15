import { useState } from "react"

const SEVERITY_STYLES = {
  critical: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
  serious: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
  moderate: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/50',
  minor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
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

  const focusRing =
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-gray-950'

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <header className="mb-3 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 sm:text-lg">
            {violation.help}
          </h3>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${severityStyle}`}>
            {violation.impact}
          </span>
        </div>
        <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
          Rule ID: <span className="text-gray-700 dark:text-gray-300">{violation.id}</span>
        </p>
      </header>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {violation.description}
      </p>

      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          {nodeCount} {nodeCount === 1 ? 'element' : 'elements'} affected
        </span>
      </div>

      <section className="mb-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Broken element{nodeCount > 1 ? 's' : ''}
        </h4>
        {shownNodes.map((node, index) => (
          <pre
            key={index}
            className="overflow-x-auto rounded-lg border border-gray-800 bg-[#1e1e1e] p-3 font-mono text-xs text-[#ce9178] shadow-inner"
          >
            <code>{node.html}</code>
          </pre>
        ))}
        {hiddenCount > 0 && (
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            + {hiddenCount} more element{hiddenCount > 1 ? 's' : ''} hidden
          </p>
        )}
      </section>

      {explanation ? (
        <section className="mb-4 space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/10">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              In simple words
            </h4>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {explanation.explanation}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Who it affects
            </h4>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {explanation.whoItAffects}
            </p>
          </div>

          {explanation.fixedCode && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                  Suggested fix
                </h4>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`rounded border ... ${focusRing}`}
                  aria-label={`Copy suggested fix for ${violation.id}`}
                >
                  <span aria-live="polite">{copied ? 'Copied!' : 'Copy Fix'}</span>
                </button>
              </div>

              <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-[#1e1e1e] p-3 font-mono text-xs text-[#4ec9b0] shadow-inner">
                <code>{explanation.fixedCode}</code>
              </pre>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-suggested fix. Review before using.
              </p>
            </div>
          )}
        </section>
      ) : (
        <p className="mb-4 text-xs italic text-gray-500 dark:text-gray-400">
          {aiEnabled
            ? 'AI explanation unavailable.'
            : 'AI explanations are off. Tick "Generate AI explanations" and scan again to get plain-English fixes.'}
        </p>
      )}

      {violation.helpUrl && (
        <a
          href={violation.helpUrl}
          target="_blank"
          rel="noreferrer"
          className={`text-sm underline ... ${focusRing}`}
        >
          Learn more about this rule
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </article>
  )
}

export default ViolationCard