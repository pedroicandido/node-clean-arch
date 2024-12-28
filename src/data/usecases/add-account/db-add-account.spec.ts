import { DbAddAccount } from "./db-add-account";

describe('DB Add Account', () => {
  test('Should call Encrypter with correct password', async () => {
    const accountData = {
      name:'valid_name',
      email: 'valid_email',
      password:'valid_password'
    }
    class EncrypterStub{
      encrypt(value: string):string{
        return 'hashed_password'  
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})