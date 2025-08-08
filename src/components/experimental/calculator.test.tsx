import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Calculator } from './Calculator'

// Testing Con Table Driven en React
describe('<Calculator />', () => {
  const useCasesTest = [
    { a: 1, b: 2, operation: 'add', expected: 3 },
    { a: 8, b: 3, operation: 'subtract', expected: 5 },
    { a: 3, b: 2, operation: 'multiply', expected: 6 },
    { a: 10, b: 2, operation: 'divide', expected: 5 },
    { a: 10, b: 0, operation: 'divide', expected: 'Error' },
    { a: 10, b: 0, operation: 'other', expected: 'Invalid operation' },
  ]

  it.each(useCasesTest)(
    'deberia retornar $expected cuando $a y $b son $operation',
    ({ a, b, operation, expected }) => {
      render(<Calculator a={a} b={b} operation={operation} />)

      const result = screen.getByText(`Result: ${expected}`)

      expect(result).toBeInTheDocument()
    }
  )
})
