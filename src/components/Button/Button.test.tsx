import { describe, it, expect, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('<Button />', () => {
  it('Deberia renderizar el boton', () => {
    render(<Button label='click' />)

    const button = screen.getByText('click')

    expect(button).toBeInTheDocument()
  })

  it('deberia llamar a la funcion onclick', async () => {
    const handleClick = vi.fn()

    render(<Button label='click' onClick={handleClick} />)

    const button = screen.getByText('click')

    act(() => {
      fireEvent.click(button) // Simula un click
      fireEvent.click(button)
    })

    expect(handleClick).toHaveBeenCalledTimes(2)
  })
})
