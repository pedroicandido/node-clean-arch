import { IAuthentication, IEmailValidator, HttpRequest, HttpResponse, IController } from "./login-protocols";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helper/http-helper";

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
      return ok({token})
    } catch (error) {
      return serverError(error)
    }
  }
}