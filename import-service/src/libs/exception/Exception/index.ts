type ExceptionBody = {
  statusCode: number
  message: string
}

export class Exception {
  statusCode: number
  body: string
  headers: any

  constructor(statusCode = 500, message = 'Internal server error') {
    this.statusCode = statusCode
    const bodyObject: ExceptionBody = {
      statusCode: statusCode,
      message: message
    }
    this.body = JSON.stringify(bodyObject)
    this.headers = {
      // Required for CORS support to work
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      // Required for cookies, authorization headers with HTTPS
      'Access-Control-Allow-Credentials': true
    }
  }
}