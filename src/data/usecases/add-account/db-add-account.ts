
import { AddAccountModel, IAddAccount, AccountModel, IEncrypter } from "./db-add-account-protocols";


export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }

}