import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Contador } from './Contador'

describe('< Contador />', () => {
  it('Deberia de mostrar el valor inicial', () => {
    render(<Contador />)
    const contador = screen.getByText('Contador: 0')

    expect(contador).toBeInTheDocument()
  })

  it('Deberia incrementar el contador', () => {
    render(<Contador />)
    const boton = screen.getByText('Incrementar')

    act(() => {
      fireEvent.click(boton)
    })

    const contador = screen.getByText('Contador: 1')
    expect(contador).toBeInTheDocument()
  })
})
