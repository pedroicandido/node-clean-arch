import { IAuthentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, serverError, unauthorized } from "../../helper/http-helper";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IEmailValidator } from "../signup/signup-protocols";

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator;
  private readonly authentication: IAuthentication;
  constructor(emailValidator: IEmailValidator, authentication: IAuthentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error)
    }
  }
}