import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";
import { DbAuthentication } from "./db-authentication";

describe('Db Authentication usecase', () => {
  test('Should call LoadAccountByEmail with correct email', async () => {
    class LoadAccountByEmailStub implements ILoadAccountEmailByRepository{
      async load(email:string): Promise<AccountModel>{
        return {
          email:'valid_email@mail.com',
          id:"any_id",
          name:"any_name",
          password:'any_password'
        }
      }
    }
    const loadAccountByEmailStub= new LoadAccountByEmailStub();
    const sut = new DbAuthentication(loadAccountByEmailStub);
    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load')
    await sut.auth({ email: 'valid_email@mail.com', password: 'any_password' })
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})