import { AccountModel } from "../../domain/models/account";
import { AddAccountModel } from "../../domain/usecases/add-account";

export interface IAddAccountRepository{
  add(account: AddAccountModel): Promise<AccountModel>;
}