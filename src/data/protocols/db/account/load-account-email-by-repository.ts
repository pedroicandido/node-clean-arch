import { AccountModel } from "../../../usecases/add-account/db-add-account-protocols";

export interface ILoadAccountEmailByRepository{
  loadByEmail(email:string): Promise<AccountModel | null>
}