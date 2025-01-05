import { ObjectId } from "mongodb";
import { IAddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { ILoadAccountEmailByRepository } from "../../../../data/protocols/db/load-account-email-by-repository";
import { IUpdateTokenRepository } from "../../../../data/protocols/db/update-token-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import MongoHelper from "../helpers/mongo-helper";

export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountEmailByRepository, IUpdateTokenRepository {
  private readonly mongoDbInstance: MongoHelper;
  constructor(mongoDbInstance: MongoHelper) {
    this.mongoDbInstance = mongoDbInstance;
  }

  async updateToken(id: string, token: string): Promise<void> {
    const accountCollection = await this.mongoDbInstance.getCollection('accounts');
    await accountCollection.updateOne({ _id: this.mongoDbInstance.toObjectId(id) }, {
      $set: {
        token
      }
    })
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await this.mongoDbInstance.getCollection('accounts');
    const account = await accountCollection.findOne({ email })
    if (!account) {
      return null;
    }
    return {
      email,
      id: account._id.toString(),
      name: account.name,
      password: account.password
    };
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