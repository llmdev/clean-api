import { ServerError } from './../errors/server-error'
import { InvalidParamError } from './../errors/invalid-param-error'
import { EmailValidator } from './../protocols/emailValidator'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import Controller from '../protocols/controller'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
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

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: {
            error: [
              new InvalidParamError('Email')
            ]
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
