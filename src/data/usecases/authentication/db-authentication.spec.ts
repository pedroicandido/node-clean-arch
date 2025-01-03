import { AuthenticationModel } from "../../../domain/usecases/authentication";
import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailStub: ILoadAccountEmailByRepository;
}


const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})

const makeFakeAuth = (): AuthenticationModel => ({ email: 'valid_email@mail.com', password: 'any_password' })

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
  const sut = new DbAuthentication(loadAccountByEmailStub);
  return { sut, loadAccountByEmailStub }
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
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load').mockReturnValue(null)
    const token = await sut.auth(makeFakeAuth())
    expect(token).toBeNull()
  })

})