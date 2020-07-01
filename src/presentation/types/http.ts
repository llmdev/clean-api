export interface HttpResponse {
  statusCode: number
  body: any
  errors?: Error[]
}

export interface HttpRequest {
  body?: any
}
