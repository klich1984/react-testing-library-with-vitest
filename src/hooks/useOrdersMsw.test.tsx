import { ReactNode } from 'react'

import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { SessionProvider, useSession } from '../context/AuthContext'
import { MemoryRouter } from 'react-router-dom'
import { act, renderHook, waitFor } from '@testing-library/react'
import useOrders from './useOrders'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext')
  return {
    ...actual,
    useSession: vi.fn(),
  }
})

describe('useOrdersMSW', () => {
  const mockUser = { id: '1', name: 'klich' }

  beforeEach(() => {
    ;(useSession as Mock).mockReturnValue({ user: mockUser })
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  )

  it('Deberia obtener bien la data', async () => {
    // handleLogin
    const { result, rerender } = renderHook(() => useOrders(), { wrapper: wrapper })
    const initialLoading = result.current.loading

    expect(initialLoading).toBe(true)

    await act(async () => rerender())

    const lengthOrders = result.current.orders.length

    await waitFor(() => {
      expect(lengthOrders).toBe(1)
    })
  })

  it('Debe obtener un error', async () => {
    server.use(
      http.get('http://localhost:3001/orders', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        })
      })
    )

    const { result, rerender } = renderHook(() => useOrders(), { wrapper: wrapper })
    const initialLoading = result.current.loading

    expect(initialLoading).toBe(true)

    await act(async () => rerender())

    await waitFor(() => {
      const error = result.current.error
      expect(error).toBe('Failed to fetch orders. Please try again later.')
    })
  })
})
