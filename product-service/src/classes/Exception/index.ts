type ExceptionBody = {
  statusCode: number
  message: string
}

export class Exception {
  statusCode: number
  body: string

  constructor(statusCode = 500, message = 'Internal server error') {
    this.statusCode = statusCode
    const bodyObject: ExceptionBody = {
      statusCode: statusCode,
      message: message
    }
    this.body = JSON.stringify(bodyObject)
  }
}