import { IAuthentication, HttpRequest, HttpResponse, IController, IValidation } from "./login-controller-protocols";
import { badRequest, ok, serverError, unauthorized } from "../../helper/http/http-helper";

export class LoginController implements IController {
  
  constructor(private readonly validation: IValidation, private readonly authentication: IAuthentication) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const token = await this.authentication.auth({ email, password })
      if (!token) {
        return unauthorized();
      }
      return ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}