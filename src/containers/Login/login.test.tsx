import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, Mock, vi } from 'vitest'
import { Login } from './Login'
import { MemoryRouter } from 'react-router-dom' // Con este se elimina el error de useNavigate
import { SessionProvider } from '../../context/AuthContext' // Con este se elimina el error de useSession
import { getAuth } from '../../services/getAuth'

// Mock del modulo de getAuth
vi.mock('../../services/getAuth', () => ({
  getAuth: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock de la promesa
const mockGetAuth = getAuth as Mock

const mockNavigate = vi.fn()

describe('<Login />', () => {
  const handleLogin = () => {
    return render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    )
  }

  it('Deberia mostrar un mensaje de error', async () => {
    mockGetAuth.mockRejectedValue(new Error('Invalid credentials'))
    handleLogin()

    // Llenar campos de los inputs y hacer click
    const userNameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const buttonLogin = screen.getByRole('button', { name: 'Login' }) // Otra opcion

    await act(() => {
      fireEvent.change(userNameInput, { target: { value: 'wroungUser' } })
      fireEvent.change(passwordInput, { target: { value: 'wroungPassword' } })
      fireEvent.click(buttonLogin)
    })

    const errorMessage = screen.getByText('Invalid credentials')

    expect(errorMessage).toBeInTheDocument()
  })

  // it.skip Para saltar la prueba
  it('Deberia redirigir a /orders', async () => {
    mockGetAuth.mockResolvedValue({ success: true })
    handleLogin()

    const userNameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const buttonLogin = screen.getByRole('button', { name: 'Login' }) // Otra opcion

    await act(() => {
      fireEvent.change(userNameInput, { target: { value: 'goodUser' } })
      fireEvent.change(passwordInput, { target: { value: 'goodPassword' } })
      fireEvent.click(buttonLogin)
    })

    await waitFor(() => {
      // Verificar que los datos que estamos enviados sean los correctos
      expect(mockGetAuth).toHaveBeenCalledWith('goodUser', 'goodPassword')
      // Verificar que este navegando
      expect(mockNavigate).toHaveBeenCalledWith('/orders')
    })
  })
})
