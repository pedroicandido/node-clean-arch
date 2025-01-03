import { AccountModel } from "../../usecases/add-account/db-add-account-protocols";

export interface ILoadAccountEmailByRepository{
  load(email:string): Promise<AccountModel>
}