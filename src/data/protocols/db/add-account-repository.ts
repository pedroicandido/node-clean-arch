import { AccountModel, AddAccountModel } from "../../usecases/add-account/db-add-account-protocols";


export interface IAddAccountRepository{
  add(account: AddAccountModel): Promise<AccountModel>;
}