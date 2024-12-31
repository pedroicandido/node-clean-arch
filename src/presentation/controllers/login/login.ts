import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError } from "../../helper/http-helper";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IEmailValidator } from "../signup/signup-protocols";

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator;
  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}