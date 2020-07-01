import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

const makeSut = (): SignUpController => new SignUpController()

describe('SignUp controller', () => {
  test('Should return 400 if no name is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        // name: 'any_name',
        email: 'anyemail@mail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ error: [new MissingParamError('name')] })
  })

  test('Should return 400 if no email and password is provider', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        // email: 'anyemail@mail.com',
        // password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: [new MissingParamError('email'), new MissingParamError('password')]
    })
  })
})
