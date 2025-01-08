import { MissingParamError, ServerError } from "../../errors";
import { IController, IEmailValidator, AccountModel, AddAccountModel, IAddAccount, HttpRequest, IValidation, IAuthentication, AuthenticationModel } from "./signup-controller-protocols";
import SignUpController from "./signup-controller";
import { badRequest, ok } from "../../helper/http/http-helper";

interface SutType {
  sut: IController,
  emailValidator: IEmailValidator
  addAccountStub: IAddAccount
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error | null{
      return null;
    }
  }
  return new ValidationStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
}


const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub();
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: AuthenticationModel): Promise<string | null> {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
}


const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication()
  const addAccountStub = makeAddAccount();
  const emailValidator = makeEmailValidator();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub,authenticationStub)
  return {
    sut,
    emailValidator,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('Signup Controller', () => {

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })


  test("Should return 500 if add account throws", async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError('any_stack'))
  })

  test("Should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
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

  test("Should call authentication with correct email", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest();
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })

})