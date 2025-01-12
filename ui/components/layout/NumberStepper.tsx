import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

type NumberStepperProps = {
  number: number
  setNumber: any
  step?: number
  max?: number
  min?: number
}

export default function NumberStepper({
  number,
  setNumber,
  step = 1,
  max,
  min,
}: NumberStepperProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function increase() {
    if (max && number + step > max) {
      return
    }
    setNumber(number + step)
    inputRef.current?.focus()
  }

  function decrease() {
    if (min !== undefined && number - step < min) {
      return
    }
    setNumber(number - step)
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center justify-between w-[100px] min-h-[35px] gradient-2 rounded-full">
      <input
        ref={inputRef}
        id="number-stepper"
        className="w-[55%] h-full bg-[#00000080] text-white text-center rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
        step={0}
      />
      <div className="w-[45%] flex flex-col justify-center items-center">
        <button onClick={increase}>
          <ChevronUpIcon className="w-4 h-4" strokeWidth={2.5} stroke="black" />
        </button>
        <button onClick={decrease}>
          <ChevronDownIcon
            className="w-4 h-4"
            strokeWidth={2.5}
            stroke="black"
          />
        </button>
      </div>
    </div>
  )
}
