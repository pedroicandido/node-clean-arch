import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import SignUpController from "../../../presentation/controllers/signup/signup-controller";
import { IController } from "../../../presentation/protocols";
import MongoHelper from "../../../infra/db/mongodb/helpers/mongo-helper";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-repository";
import { makeSignUpValidation } from "./signup-validation-factory";



export const makeSignupController = (): IController => {
  const mongoInstance = MongoHelper.getInstance();
  const logErrorRepository = new LogMongoRepository(mongoInstance)
  const hasher = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository(mongoInstance);
  const addAccount = new DbAddAccount(hasher, addAccountRepository);
  const signUpController = new SignUpController(addAccount, makeSignUpValidation());
  const logControllerDecorator = new LogControllerDecorator(signUpController, logErrorRepository)
  return logControllerDecorator;
}