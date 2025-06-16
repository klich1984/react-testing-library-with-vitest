import { describe, it, expect } from 'vitest'

describe('Mi primer test', () => {
  it('la suma de dos numeros', () => {
    const add = (a: number, b: number) => a + b
    const result = add(2, 3)
    // El expect se ve como un if si se cumple pas si no se cumple esta malo y no pasa
    expect(result).toBe(5)
  })

  it('Dos testos iguales', () => {
    const text1 = 'Carlos'
    const text2 = 'Carlos'

    expect(text1).toBe(text2)
  })
})
