import { AddAccount } from './../../domain/usecases/add-account'
import { ServerError, InvalidParamError, MissingParamError } from './../errors'
import { HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import Controller from '../protocols/controller'

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

  handle (httpRequest: HttpRequest<HttpRequestSignupController>): HttpResponse {
    try {
      const { email, password, passwordConfirm, name } = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      const errors = requiredFields.map(field => {
        if (!httpRequest.body[field]) {
          return new MissingParamError(field)
        }
      }).filter(f => f !== undefined)

      if (errors.length) {
        return {
          statusCode: 400,
          body: {
            error: errors
          }
        }
      }

      const passwordEqual = password === passwordConfirm
      if (!passwordEqual) {
        return {
          statusCode: 400,
          body: {
            error: new InvalidParamError('password')
          }
        }
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: {
            error: new InvalidParamError('Email')
          }
        }
      }

      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (err) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
