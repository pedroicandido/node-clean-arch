import { HttpRequest, HttpResponse, IController } from "../../presentation/protocols"
import { LogControllerDecorator } from "./log"


interface SutTypes {
  controllerStub: IController;
  sut: IController
}


const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          name: "any_name",
          email: 'any_email',
          password: 'any_password',
          id: 'any_id'
        }
      }
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
})