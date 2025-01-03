import { badRequest, ok, serverError } from "../../helper/http-helper"
import { IController, HttpRequest, HttpResponse, IAddAccount, IValidation } from "./signup-protocols"

export default class SignUpController implements IController {

  private readonly addAccount: IAddAccount
  private readonly validation: IValidation

  constructor(addAccount: IAddAccount, validation: IValidation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }
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
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}