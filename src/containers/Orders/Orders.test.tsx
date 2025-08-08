import { describe, expect, it, Mock, vi } from 'vitest'
import { Orders } from './Orders'
import { MemoryRouter } from 'react-router-dom'
import { SessionProvider, useSession } from '../../context/AuthContext'
import { render, screen, waitFor } from '@testing-library/react'
import { getOrders } from '../../services/getOrders'
import { getSummaryOrders } from '../../utils/sumamry'

vi.mock('../../services/getOrders', () => ({
  getOrders: vi.fn(),
}))

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')

  return {
    ...actual,
    useSession: vi.fn(),
  }
})

const mockgetOrders = getOrders as Mock

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

const mockUseSession = useSession as Mock

describe('<Orders />', () => {
  const handleRenderOrders = (userRole: string) => {
    const mockUser = userRole ? { role: userRole } : null

    // (useSession as Mock).mockReturnValue()
    mockUseSession.mockReturnValue({ user: mockUser })

    return render(
      <MemoryRouter>
        <SessionProvider>
          <Orders />
        </SessionProvider>
      </MemoryRouter>
    )
  }

  it('Deberia mostrar las ordenes', async () => {
    mockgetOrders.mockResolvedValue(mockOrders)
    handleRenderOrders('visualizer')

    await waitFor(() => {
      const orders = screen.getAllByRole('heading', { level: 3 })

      expect(orders).toHaveLength(mockOrders.length)
    })
  })

  it('Deberia de mostrar seccion para superadmin con los cálculos correctos', async () => {
    // Arrange: Preparamos los mocks y renderizamos el componente
    mockgetOrders.mockResolvedValue(mockOrders)
    handleRenderOrders('superadmin')

    await waitFor(() => {
      // Act: Obtenemos los valores esperados usando la misma función de utilidad
      const { totalOrders, averageOrderValue, totalValue, ordersByStatus } =
        getSummaryOrders(mockOrders)

      // Assert: Comparamos los valores esperados con lo que se muestra en pantalla
      // 1. Test para Total Orders
      const totalOrdersElement = screen.getByTestId('totalOrders').textContent

      expect(totalOrdersElement).toBe(totalOrders.toString())

      // 2. Test para Total Value
      const totalValueElement = screen.getByTestId('totalValues')
      const expectTotalValue = `$${totalValue.toFixed(2)}`

      expect(totalValueElement.textContent).toBe(expectTotalValue)

      // 3. Test para Average Order Value
      const averageValueElement = screen.getByTestId('averageOrderValue')
      const expectAverageValue = `$${averageOrderValue.toFixed(2)}`

      expect(averageValueElement.textContent).toBe(expectAverageValue)

      // 4. Test para Orders by Status
      // Iteramos sobre el objeto de estados que calculamos
      Object.entries(ordersByStatus).forEach(([status, count]) => {
        const statusCountElement = screen.getByTestId(`status-count-${status}`)

        expect(statusCountElement.textContent).toBe(count.toString())
      })
    })
  })
})
