
import { DbAddAccount } from "./db-add-account";
import { AccountModel, AddAccountModel, AuthenticationModel, IAddAccount, IAddAccountRepository, IHasher, ILoadAccountEmailByRepository } from "./db-add-account-protocols";

type SutTypes = {
  sut: IAddAccount;
  hasherStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository
  loadAccountByEmailStub: ILoadAccountEmailByRepository;
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepository implements IAddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return {
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
        id: 'valid_id'
      }
    }
  }
  return new AddAccountRepository();
}

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    hash(value: string): string {
      return 'hashed_password'
    }
  }
  return new HasherStub();
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'loaded_hashed',
})

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
})

const makeAccountRepository = (): ILoadAccountEmailByRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountEmailByRepository {
    async loadByEmail(email: string): Promise<AccountModel | null> {
      return null;
    }
  }
  return new LoadAccountByEmailRepositoryStub();
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeAccountRepository();
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailStub);
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailStub }
}



describe('DB Add Account', () => {
  test('Should call Hasher with correct password', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, hasherStub } = makeSut();

    const encryptSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementation(() => {
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

  test('Should throw if AddAccountRepository throws', async () => {
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementation(() => {
      throw new Error('error');
    });
    const promise = sut.add(accountData)
    expect(promise).rejects.toThrow('error');
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toEqual({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
      id: 'valid_id'
    })
  })

  test('Should return null if LoadAccountByEmail not returns null', async () => {
    const { sut, loadAccountByEmailStub } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValue(Promise.resolve(makeFakeAccount()))
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmail with correct email', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.add(makeFakeAddAccount())
    expect(loadSpy).toHaveBeenCalledWith('valid_email')
  })

})