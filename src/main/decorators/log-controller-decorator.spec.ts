import { ILogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
import { serverError } from "../../presentation/helper/http/http-helper";
import { HttpRequest, HttpResponse, IController } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log-controller-decorator"


interface SutTypes {
  controllerStub: IController;
  sut: IController;
  logErrorRepositoryStub: ILogErrorRepository
}

const FAKE_HTTP_RESPONSE = {
  statusCode: 200,
  body: {
    name: "any_name",
    email: 'any_email',
    password: 'any_password',
    id: 'any_id'
  }
}



const makeLogErrorRepositoryStub = () => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise((resolve) => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}



const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return FAKE_HTTP_RESPONSE
    }
  }
  return new ControllerStub();
}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { controllerStub, sut, logErrorRepositoryStub }
}

describe('Log Controller decorator', () => {
  test('Should call controller handle method', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        name: "any_name",
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut, } = makeSut()
    const httpRequest = {
      body: {
        name: "any_name",
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(FAKE_HTTP_RESPONSE)
  })

  test('Should call LogErrorRepository if controller returns an server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const httpRequest = {
      body: {
        name: "any_name",
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})