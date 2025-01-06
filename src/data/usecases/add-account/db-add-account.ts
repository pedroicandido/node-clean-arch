
import { AddAccountModel, IAddAccount, AccountModel, IHasher, IAddAccountRepository } from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {

  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) { }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
}