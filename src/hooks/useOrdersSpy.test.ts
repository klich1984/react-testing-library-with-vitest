import * as ReactRouter from 'react-router-dom'

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  Mock,
  MockInstance,
  vi,
} from 'vitest'
import * as AuthContext from '../context/AuthContext'
import * as OrderService from '../services/getOrders'
import { act, renderHook, waitFor } from '@testing-library/react'
import useOrders from './useOrders'

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

describe('useOrderSpy', () => {
  let useSessionSpy: MockInstance
  let getOrdersSpy: MockInstance
  const mockNavigate = vi.fn()

  beforeEach(() => {
    // Inicializar los Spy
    useSessionSpy = vi.spyOn(AuthContext, 'useSession')
    getOrdersSpy = vi.spyOn(OrderService, 'getOrders')
    ;(ReactRouter.useNavigate as Mock).mockReturnValue(mockNavigate)

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Deberia mostrar un error', async () => {
    useSessionSpy.mockReturnValue({ user: { id: 1, role: 'visualizer' } })
    getOrdersSpy.mockRejectedValue(new Error('Api error'))
    const { result, rerender } = renderHook(() => useOrders())

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await act(() => rerender())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to fetch orders. Please try again later.')
      expect(result.current.orders).toEqual([])
      expect(getOrdersSpy).toHaveBeenCalledTimes(1)
    })
  })
})
