import { IAddAccount } from "../../../domain/usecases/add-account";
import { IEncrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: IAddAccount;
  encrypterStub: IEncrypter
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
  const sut = new DbAddAccount(encrypterStub);
  return { sut, encrypterStub }
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
})