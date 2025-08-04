import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, Mock, vi } from 'vitest'
import { Login } from './Login'
import { MemoryRouter } from 'react-router-dom' // Con este se elimina el error de useNavigate
import { SessionProvider } from '../../context/AuthContext' // Con este se elimina el error de useSession
import { getAuth } from '../../services/getAuth'

// Mock del modulo de getAuth
vi.mock('../../services/getAuth', () => ({
  getAuth: vi.fn(),
}))

// Mock de la promesa
const mockGetAuth = getAuth as Mock

describe('<Login />', () => {
  it('Deberia mostrar un mensaje de error', async () => {
    mockGetAuth.mockRejectedValue(new Error('Invalid credentials'))

    render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    )

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
})
