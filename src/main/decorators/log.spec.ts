import { HttpRequest, HttpResponse, IController } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"


interface SutTypes {
  controllerStub: IController;
  sut: IController
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



const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return FAKE_HTTP_RESPONSE
    }
  }
  return new ControllerStub();
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub)
  return { controllerStub, sut }
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
})