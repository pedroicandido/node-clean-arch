import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helper/http-helper"
import { IController } from "../protocols/controller"
import { HttpRequest, HttpResponse } from "../protocols/http"

export default class SignUpController implements IController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}