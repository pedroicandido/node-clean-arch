import env from "../../../config/env";
import { DbAuthentication } from "../../../../data/usecases/authentication/db-authentication";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../../infra/criptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";
import MongoHelper from "../../../../infra/db/mongodb/helpers/mongo-helper";
import { IAuthentication } from "../../../../domain/usecases/authentication";


export const makeAuthentication = (): IAuthentication => {
  const mongoInstance = MongoHelper.getInstance();
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const bcryptAdapter = new BcryptAdapter(12);
  const loadAccountByEmailRepository = new AccountMongoRepository(mongoInstance);
  const dbAuthentication = new DbAuthentication(loadAccountByEmailRepository, bcryptAdapter, jwtAdapter, loadAccountByEmailRepository);
  return dbAuthentication;

}