import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";
import MongoHelper from "../../../../infra/db/mongodb/helpers/mongo-helper";
import { IAddAccount } from "../../../../domain/usecases/add-account";

export const makeDbAddAccount = (): IAddAccount => {
  const mongoInstance = MongoHelper.getInstance();
  const hasher = new BcryptAdapter(12);
  const accountRepository = new AccountMongoRepository(mongoInstance);
  const addAccount = new DbAddAccount(hasher, accountRepository, accountRepository);
  return addAccount
}