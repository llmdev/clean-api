import { HttpResponse } from './../protocols/http'

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: {
    error
  }
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})
