import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

interface MakeSutType {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): MakeSutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  return {
    sut: new SignUpController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp controller', () => {
  test('Should return 400 if no name is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: '',
        email: 'anyemail@mail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({ error: [new MissingParamError('name')] })
  })

  test('Should return 400 if no email and password is provider', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: '',
        password: '',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: [new MissingParamError('email'), new MissingParamError('password')]
    })
  })

  test('Should return 400 if confirm password not equal password', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'anyemail@mail.com',
        password: 'password',
        passwordConfirm: 'password_diferent'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: new InvalidParamError('password')
    })
  })

  test('Should return 400 if an invalid email', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: new InvalidParamError('Email')
    })
  })

  test('Should call email validator with correct email', async () => {
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
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 500 server error if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new ServerError()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email',
      password: 'password'
    })
  })

  test('Should call AddAccount with invalid values, return throw ServerError', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'password',
        passwordConfirm: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 200 if send correct values', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})
