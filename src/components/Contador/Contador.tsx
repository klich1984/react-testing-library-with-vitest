import { useState } from 'react'

export const Contador = () => {
  const [contador, setContador] = useState(0)

  const handleIncrement = () => {
    setContador(contador + 1)
  }

  return (
    <>
      <div>Contador: {contador}</div>
      <button onClick={handleIncrement}>Incrementar</button>
    </>
  )
}
