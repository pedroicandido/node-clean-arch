
import { AddAccountModel, IAddAccount, AccountModel, IHasher, IAddAccountRepository, ILoadAccountEmailByRepository } from "./db-add-account-protocols";

export class DbAddAccount implements IAddAccount {

  constructor(
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmail: ILoadAccountEmailByRepository
  ) { }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmail.loadByEmail(accountData.email)
    const hashedPassword = this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return account
  }
}