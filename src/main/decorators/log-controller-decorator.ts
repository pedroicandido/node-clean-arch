import { ILogErrorRepository } from "../../data/protocols/db/log/log-error-repository";
import { HttpRequest, HttpResponse, IController } from "../../presentation/protocols";

export class LogControllerDecorator implements IController {

  constructor(private readonly controller: IController, private readonly logErrorRepository:ILogErrorRepository) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const HttpResponse = await this.controller.handle(httpRequest)
    if (HttpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(HttpResponse.body.stack)
    }
    return HttpResponse
  }

}
