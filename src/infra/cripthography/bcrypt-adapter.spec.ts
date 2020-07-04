import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash_value'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const encryptSalt = 12
    const sut = new BcryptAdapter(encryptSalt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', encryptSalt)
  })

  test('Should return a hash on success', async () => {
    const encryptSalt = 12
    const sut = new BcryptAdapter(encryptSalt)
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash_value')
  })
})
