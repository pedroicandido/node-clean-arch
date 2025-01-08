import { badRequest, ok, serverError } from "../../helper/http/http-helper"
import { IController, HttpRequest, HttpResponse, IAddAccount, IValidation, IAuthentication } from "./signup-controller-protocols"

export default class SignUpController implements IController {

  constructor(private readonly addAccount: IAddAccount, private readonly validation: IValidation, private readonly authentication: IAuthentication) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { password, email, name } = httpRequest.body;
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      const token = await this.authentication.auth({ email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}