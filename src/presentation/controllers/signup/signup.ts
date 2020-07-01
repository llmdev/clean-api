import { ok, badRequest, serverError } from './../../helpers/http-helper'
import { ServerError, InvalidParamError, MissingParamError } from '../../errors'
import { HttpRequest, HttpResponse, EmailValidator, AddAccount } from './signup-protocols'
import Controller from '../../protocols/controller'

interface HttpRequestSignupController {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest<HttpRequestSignupController>): Promise<HttpResponse> {
    try {
      const { email, password, passwordConfirm, name } = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      const errors = requiredFields.map(field => {
        if (!httpRequest.body[field]) {
          return new MissingParamError(field)
        }
      }).filter(f => f !== undefined)

      if (errors.length) {
        return badRequest(errors)
      }

      const passwordEqual = password === passwordConfirm
      if (!passwordEqual) {
        return badRequest(new InvalidParamError('password'))
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('Email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (err) {
      return serverError(new ServerError())
    }
  }
}
