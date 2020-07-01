import { HttpResponse, HttpRequest } from './http'

interface Controller {
  handle: (httpRequest: HttpRequest) => HttpResponse
}

export default Controller
