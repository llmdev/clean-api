export interface HttpResponse {
  statusCode: number
  body: any
  errors?: Error[]
}

export interface HttpRequest<T> {
  body?: T
}
