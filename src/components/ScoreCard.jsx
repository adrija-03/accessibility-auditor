function ScoreCard({ score }) {

  const getScoreColor = (val) => {
    if (val >= 90) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30'
    if (val >= 50) return 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-50 dark:bg-amber-950/30'
    return 'text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-50 dark:bg-rose-950/30'
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Score Card</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-3xl font-bold tracking-tight ${getScoreColor(score)}`}>
          {score}
        </span>
        <span className="text-lg font-medium text-gray-400 dark:text-gray-500">/100</span>
      </div>
    </div>
  )
}

export default ScoreCard