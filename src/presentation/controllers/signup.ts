import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helper/http-helper"
import { IController } from "../protocols/controller"
import { IEmailValidator } from "../protocols/email-validator"
import { HttpRequest, HttpResponse } from "../protocols/http"

export default class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}