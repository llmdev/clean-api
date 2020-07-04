import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const encryptSalt = 12
jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash_value'))
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(encryptSalt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const encryptSalt = 12
    const sut = new BcryptAdapter(encryptSalt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', encryptSalt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash_value')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
