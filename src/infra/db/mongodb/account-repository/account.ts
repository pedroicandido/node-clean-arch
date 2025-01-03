import { IAddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import MongoHelper from "../helpers/mongo-helper";

export class AccountMongoRepository implements IAddAccountRepository {
  private readonly mongoDbInstance: MongoHelper;
  constructor(mongoDbInstance: MongoHelper) {
    this.mongoDbInstance = mongoDbInstance;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await this.mongoDbInstance.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData)
    return {
      ...accountData,
      id: result.insertedId.toString()
    }
  }

}