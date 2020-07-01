import { ServerError } from './../errors/server-error'
import { EmailValidator } from './../protocols/emailValidator'
import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from './../errors/invalid-param-error'

interface MakeSutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): MakeSutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()

  return {
    sut: new SignUpController(emailValidatorStub),
    emailValidatorStub
  }
}

describe('SignUp controller', () => {
  test('Should return 400 if no name is provider', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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

  test('Should return 400 if confirm password not equal password', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'anyemail@mail.com',
        password: 'password',
        passwordConfirm: 'password_diferent'
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: new InvalidParamError('password')
    })
  })

  test('Should return 400 if an invalid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: new InvalidParamError('Email')
    })
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 server error if email validator throws', () => {
    class EmailValidatorThrowStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorThrowStub()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
