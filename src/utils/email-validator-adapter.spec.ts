import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator function with email', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@email.com')
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    expect(isValid).toBe(true)
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@email.com')
    expect(isEmailSpy).toHaveBeenCalledTimes(1)
  })
})
