import { IAuthentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError, ServerError } from "../../errors";

import { badRequest, ok, serverError } from "../../helper/http-helper";
import { HttpRequest, IController } from "../../protocols";
import { IEmailValidator } from "../signup/signup-protocols";
import { LoginController } from "./login";

interface SutType {
  sut: IController,
  emailValidatorStub: IEmailValidator
  authenticationStub: IAuthentication
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<string> | null {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub();
}


const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication()
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  }
})


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

  test("Should call email validator with correct email", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test("Should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
    const httpRequest = {
      body: {
        email: 'any_invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test("Should return 500 if email validator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new ServerError('any_error') })
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError('any_error')))
  })

  test("Should call authentication with correct email", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

})