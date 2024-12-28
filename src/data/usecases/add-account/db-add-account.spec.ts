
import { DbAddAccount } from "./db-add-account";
import { AccountModel, AddAccountModel, IAddAccount, IAddAccountRepository, IEncrypter } from "./db-add-account-protocols";

interface SutTypes {
  sut: IAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepository implements IAddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return {
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
        id: ''
      }
    }
  }
  return new AddAccountRepository();
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt(value: string): string {
      return 'hashed_password'
    }
  }
  return new EncrypterStub();
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return { sut, encrypterStub, addAccountRepositoryStub }
}



describe('DB Add Account', () => {
  test('Should call Encrypter with correct password', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if encrypter throws', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
      throw new Error('error');
    });
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow('error');
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    })
  })
})