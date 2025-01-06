import env from "../../config/env";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import MongoHelper from "../../../infra/db/mongodb/helpers/mongo-helper";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { IController } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { makeLoginValidation } from "./login-validation-factory";


export const makeLoginController = (): IController => {
  const mongoInstance = MongoHelper.getInstance();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(12);
  const loadAccountByEmailRepository = new AccountMongoRepository(mongoInstance);
  const dbAuthentication = new DbAuthentication(loadAccountByEmailRepository, bcryptAdapter, jwtAdapter, loadAccountByEmailRepository);
  const logErrorRepository = new LogMongoRepository(mongoInstance)
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication);
  const logControllerDecorator = new LogControllerDecorator(loginController, logErrorRepository)
  return logControllerDecorator;
}