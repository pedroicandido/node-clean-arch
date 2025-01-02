import { MissingParamError, ServerError } from "../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../helper/http-helper";
import { LoginController } from "./login";
import { IAuthentication, HttpRequest, IController, IValidation } from "./login-protocols";


interface SutType {
  sut: IController,
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub()
}


const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<string> | null {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
}




const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation();
  const sut = new LoginController(validationStub, authenticationStub)
  return {
    sut,
    validationStub,
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
  
  test("Should call authentication with correct email", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValue(null)
    const httpRequest = {
      body: {
        email: 'any_invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized())
  })

  test("Should return 500 if authentication throws", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new ServerError('any_error') })
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError('any_error')))
  })

  test("Should return 200 and a token if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
  })

    test("Should call Validation with correct values", async () => {
      const { sut, validationStub } = makeSut();
      const validateSpy = jest.spyOn(validationStub, 'validate')
      const httpRequest = makeFakeHttpRequest();
      await sut.handle(httpRequest);
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  
    test("Should return 400 if validation returns an error", async () => {
      const { sut, validationStub } = makeSut();
      jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any_field'))
      const httpRequest = makeFakeHttpRequest();
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
    })

})