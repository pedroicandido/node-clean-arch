import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import SignUpController from "../../presentation/controllers/signup/signup";
import { IController } from "../../presentation/protocols";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import MongoHelper from "../../infra/db/mongodb/helpers/mongo-helper";


export const makeSignupController = (): IController => {
  const mongoInstance = MongoHelper.getInstance();
  const encrypter = new BcryptAdapter(12);
  const addAccountRepository= new AccountMongoRepository(mongoInstance);
  const addAccount = new DbAddAccount(encrypter, addAccountRepository);
  const emailValidator = new EmailValidatorAdapter();
  const signUpController = new SignUpController(emailValidator, addAccount);
  return signUpController;
}