import ViolationCard from './ViolationCard'

function ViolationsList({ violations, explanations, aiEnabled }) {

  return (
    <ul
      role="list"
      aria-label="Accessibility violations"
      className="space-y-4"
    >
      {violations.map((v) => (
        <li key={v.id} className='list-none'>
          <ViolationCard
            violation={v}
            explanation={explanations[v.id]}
            aiEnabled={aiEnabled}
          />
        </li>
      ))}
    </ul>
  )
}

export default ViolationsList