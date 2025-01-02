import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import SignUpController from "../../presentation/controllers/signup/signup";
import { IController } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import MongoHelper from "../../infra/db/mongodb/helpers/mongo-helper";
import { LogControllerDecorator } from "../decorators/log";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import { makeSignUpValidation } from "./signup-validation";



export const makeSignupController = (): IController => {
  const mongoInstance = MongoHelper.getInstance();
  const logErrorRepository = new LogMongoRepository(mongoInstance)
  const encrypter = new BcryptAdapter(12);
  const addAccountRepository = new AccountMongoRepository(mongoInstance);
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const emailValidator = new EmailValidatorAdapter();
  const signUpController = new SignUpController(addAccount, makeSignUpValidation());
  const logControllerDecorator = new LogControllerDecorator(signUpController, logErrorRepository)
  return logControllerDecorator;
}