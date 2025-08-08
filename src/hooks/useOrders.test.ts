import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { getOrders } from '../services/getOrders'
import { useSession } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import useOrders from './useOrders'
import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'

vi.mock('../services/getOrders', () => ({
  getOrders: vi.fn(),
}))

vi.mock('../context/AuthContext', () => ({
  useSession: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

const mockOrders = [
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    customer: {
      id: '99bd3a64-13f7-4b37-9706-e71f8d0d9cf4',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    products: [
      {
        id: '404daf2a-9b97-41f3-b04d-e3e5a7dc8cb4',
        name: 'Smartphone',
        price: 699.99,
        quantity: 1,
      },
      {
        id: '6d62d909-f957-430e-8689-b5129c0bb75e',
        name: 'Phone Case',
        price: 19.99,
        quantity: 1,
      },
      {
        id: '3c7eb6bc-a146-4523-a442-f6c676f5a5f7',
        name: 'Screen Protector',
        price: 9.99,
        quantity: 2,
      },
    ],
    total: 739.96,
    status: 'processing',
    orderDate: '2023-10-05T14:30:00Z',
    shippingAddress: {
      street: '456 Elm St',
      city: 'Other City',
      state: 'NY',
      zipCode: '67890',
      country: 'USA',
    },
    paymentMethod: 'paypal',
  },
]

describe('useOrders', () => {
  const mockNavigate = vi.fn()
  const mockGetOrders = getOrders as Mock
  const mockUseSession = useSession as Mock

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useNavigate as Mock).mockReturnValue(mockNavigate)
  })

  it('Deberia obtener las ordenes', async () => {
    mockGetOrders.mockResolvedValue(mockOrders)
    mockUseSession.mockReturnValue({ user: { id: 1 }, role: 'visualizer' })

    const { result, rerender } = renderHook(() => useOrders())

    expect(result.current.loading).toBe(true)

    await act(() => rerender())

    expect(result.current.loading).toBe(false)
    expect(result.current.orders).toEqual(mockOrders)
    expect(result.current.error).toBe(null)
  })

  it('Debería establecer un mensaje de error si la obtención de órdenes falla', async () => {
    // 1. Arrange (Organizar): Configuramos el escenario de error.
    mockUseSession.mockReturnValue({ user: { id: 1, role: 'visualizer' } })
    mockGetOrders.mockRejectedValue(new Error('Api is down'))

    // 2. Act (Actuar): Renderizamos el hook.
    const { result } = renderHook(() => useOrders())

    // 3. Assert (Afirmar): Verificamos el estado final del hook.
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Failed to fetch orders. Please try again later.')
      expect(result.current.orders).toEqual([])
    })
  })
})
