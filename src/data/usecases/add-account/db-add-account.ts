
import { AddAccountModel, IAddAccount, AccountModel, IEncrypter, IAddAccountRepository } from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;

  constructor(encrypter: IEncrypter, addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = this.encrypter.encrypt(accountData.password)
    await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return new Promise(resolve => resolve(null))
  }

}