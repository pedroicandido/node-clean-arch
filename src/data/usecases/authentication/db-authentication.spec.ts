import { DbAuthentication } from "./db-authentication";
import {
  AuthenticationModel,
  IHashCompare,
  IEncrypter,
  ILoadAccountEmailByRepository,
  IUpdateTokenRepository,
  AccountModel
} from "./db-authentication-protocols";


type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailStub: ILoadAccountEmailByRepository;
  hashComparerStub: IHashCompare;
  encrypterStub: IEncrypter;
  updateTokenRepositoryStub: IUpdateTokenRepository;
}

const makeUpdateToken = (): IUpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements IUpdateTokenRepository {
    async updateToken(id: string, token: string): Promise<void> {
      return null
    }
  }
  return new UpdateTokenRepositoryStub();
}

const makeHashCompare = (): IHashCompare => {
  class HashComparerStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve, reject) => resolve(true))
    }
  }
  return new HashComparerStub();
}

const makeTokenGenerator = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt(value: string): string {
      return 'any_token'
    }
  }
  return new EncrypterStub();
}


const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'loaded_hashed',
})

const makeFakeAuth = (): AuthenticationModel => ({ email: 'valid_email@mail.com', password: 'hashed_password' })

const makeAccountRepository = (): ILoadAccountEmailByRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountEmailByRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
}

const makeSut = (): SutTypes => {
  const updateTokenRepositoryStub = makeUpdateToken();
  const loadAccountByEmailStub = makeAccountRepository();
  const hashComparerStub = makeHashCompare();
  const encrypterStub = makeTokenGenerator();
  const sut = new DbAuthentication(
    loadAccountByEmailStub,
    hashComparerStub,
    encrypterStub,
    updateTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
    encrypterStub,
    updateTokenRepositoryStub
  }
}

describe('Db Authentication usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'loadByEmail')
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Should throws if repository throws', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'loadByEmail').mockReturnValue(null)
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })

  test('Should call HashComparer with correct password hash', async () => {
    const { hashComparerStub, sut } = makeSut();
    const hashSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuth())
    expect(hashSpy).toHaveBeenCalledWith('hashed_password', 'loaded_hashed')
  })

  test('Should return null if hash comparer returns false', async () => {
    const { hashComparerStub, sut } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValue(false)
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull();
  })


  test('Should throws if HashComparer throws', async () => {
    const { hashComparerStub, sut } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { encrypterStub, sut } = makeSut();
    const tokenSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuth())
    expect(tokenSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should throws if TokenGenerator throws', async () => {
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { sut } = makeSut();
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBe('any_token')
  })

  test('Should call UpdateTokenRepository with correct values', async () => {
    const { updateTokenRepositoryStub, sut } = makeSut();
    const updateTokenSpy = jest.spyOn(updateTokenRepositoryStub, 'updateToken')
    await sut.auth(makeFakeAuth())
    expect(updateTokenSpy).toHaveBeenCalledWith('valid_id', 'any_token')
  })

  test('Should throws if UpdateTokenRepository throws', async () => {
    const { updateTokenRepositoryStub, sut } = makeSut();
    jest.spyOn(updateTokenRepositoryStub, 'updateToken').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

})