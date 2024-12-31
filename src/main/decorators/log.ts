import { ILogErrorRepository } from "../../data/protocols/log-error-repository";
import { HttpRequest, HttpResponse, IController } from "../../presentation/protocols";

export class LogControllerDecorator implements IController {
  private readonly controller: IController;
  private readonly logErrorRepository: ILogErrorRepository;

  constructor(controller: IController, logErrorRepository:ILogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const HttpResponse = await this.controller.handle(httpRequest)
    if (HttpResponse.statusCode === 500) {
      await this.logErrorRepository.log(HttpResponse.body.stack)
    }
    return HttpResponse
  }

}
