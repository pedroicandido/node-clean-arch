import { MissingParamError } from "../../errors";
import { badRequest } from "../../helper/http-helper";
import { HttpRequest, HttpResponse, IController } from "../../protocols";

export class LoginController implements IController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}