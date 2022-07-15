type ExceptionBody = {
  statusCode: number
  message: string
}

export class Exception {
  statusCode: number
  body: string

  constructor(statusCode, message) {
    this.statusCode = statusCode
    const bodyObject: ExceptionBody = {
      statusCode: statusCode,
      message: message
    }
    this.body = JSON.stringify(bodyObject)
  }
}