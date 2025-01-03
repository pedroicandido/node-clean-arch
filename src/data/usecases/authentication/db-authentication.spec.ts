import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { IHashCompare } from "../../protocols/criptography/hash-comparer";
import { ITokenGenerator } from "../../protocols/criptography/token-generator";
import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailStub: ILoadAccountEmailByRepository;
  hashComparerStub: IHashCompare;
  tokenGeneratorStub: ITokenGenerator;
}

const makeHashCompare = (): IHashCompare => {
  class HashComparerStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve, reject) => resolve(true))
    }
  }
  return new HashComparerStub();
}

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(id: string): Promise<string> {
      return new Promise((resolve, reject) => resolve('any_token'))
    }
  }
  return new TokenGeneratorStub();
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
    async load(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }
  return new LoadAccountByEmailRepositoryStub();
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeAccountRepository();
  const hashComparerStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(loadAccountByEmailStub, hashComparerStub, tokenGeneratorStub);

  return {
    sut,
    loadAccountByEmailStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}

describe('Db Authentication usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load')
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })

  test('Should throws if repository throws', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'load').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailStub, sut } = makeSut();
    jest.spyOn(loadAccountByEmailStub, 'load').mockReturnValue(null)
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })

  test('Should call HashComparer with correct password hash', async () => {
    const { hashComparerStub, sut } = makeSut();
    const hashSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuth())
    expect(hashSpy).toHaveBeenCalledWith('hashed_password', 'loaded_hashed')
  })

  
  test('Should throws if HashComparer throws', async () => {
    const { hashComparerStub, sut } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    const tokenSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuth())
    expect(tokenSpy).toHaveBeenCalledWith('valid_id')
  })

  test('Should throws if TokenGenerator throws', async () => {
    const { tokenGeneratorStub, sut } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    expect(promise).rejects.toThrow()
  })

})