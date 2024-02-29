type StepsProps = {
  id?: string
  steps: string[]
  currStep: number
  className?: string
}

export function Steps({ id, steps, currStep, className = '' }: StepsProps) {
  return (
    <ul id={id} className={`steps ${className}`}>
      {steps.map((step, i) => (
        <li key={i} className={`step ${i <= currStep ? 'step-secondary' : ''}`}>
          {step}
        </li>
      ))}
    </ul>
  )
}