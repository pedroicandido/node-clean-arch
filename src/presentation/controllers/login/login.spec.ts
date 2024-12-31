import { MissingParamError } from "../../errors";

import { badRequest, ok } from "../../helper/http-helper";
import { IController } from "../../protocols";
import { LoginController } from "./login";

interface SutType {
  sut: IController,
}
const makeSut = (): SutType => {
  const sut = new LoginController()
  return {
    sut,
  }
}

describe('Signup Controller', () => {
  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})