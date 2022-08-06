import { Exception } from "../Exception";

export class BadRequestException extends Exception {
  constructor(message?: string) {
    super(400, message || 'Bad request')
  }
}