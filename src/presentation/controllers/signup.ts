import { HttpRequest, HttpResponse } from '../types/http'
import { MissingParamError } from '../errors/missing-param-error'
import Controller from '../types/controller'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
    const errors = requiredFields.map(field => {
      if (!httpRequest.body[field]) {
        return new MissingParamError(field)
      }
    }).filter(d => d !== undefined)

    if (errors.length) {
      return {
        statusCode: 400,
        body: {
          error: errors
        }
      }
    }
  }
}
