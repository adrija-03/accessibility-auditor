import ViolationCard from './ViolationCard'

function ViolationsList({ violations, explanations }) {
  console.log(violations)
  return (
    <ul>
      {violations.map((v) => (
        <li key={v.id}>
          <ViolationCard
            violation={v}
            explanation={explanations[v.id]}
          />
        </li>
      ))}
    </ul>
  )
}

export default ViolationsList