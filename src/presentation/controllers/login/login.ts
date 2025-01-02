import { IAuthentication, HttpRequest, HttpResponse, IController, IValidation } from "./login-protocols";
import { badRequest, ok, serverError, unauthorized } from "../../helper/http-helper";

export class LoginController implements IController {
  private readonly authentication: IAuthentication;
  private readonly validation: IValidation
  constructor(validation: IValidation, authentication: IAuthentication) {
    this.validation = validation;
    this.authentication = authentication;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized();
      }
      return ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}