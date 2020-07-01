import { ServerError, InvalidParamError, MissingParamError } from './../errors'
import { HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import Controller from '../protocols/controller'

interface HttpRequestSignupController {
  name?: string
  email?: string
  password?: string
  passwordConfirm: string
}

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest<HttpRequestSignupController>): HttpResponse {
    try {
      const { email, password, passwordConfirm } = httpRequest.body
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
    } catch (err) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
