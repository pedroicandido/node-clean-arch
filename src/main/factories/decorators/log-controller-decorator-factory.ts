import MongoHelper from "../../../infra/db/mongodb/helpers/mongo-helper";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { IController } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";


export const makeLogControllerDecorator = (controller: IController): IController => {
  const mongoInstance = MongoHelper.getInstance();
  const logErrorRepository = new LogMongoRepository(mongoInstance)
  const logControllerDecorator = new LogControllerDecorator(controller, logErrorRepository)
  return logControllerDecorator;
}