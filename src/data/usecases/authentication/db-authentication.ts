
import { AuthenticationModel, IAuthentication } from "../../../domain/usecases/authentication";
import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountEmailByRepository;
  constructor(loadAccountByEmailRepository: ILoadAccountEmailByRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }
  async auth(authentication: AuthenticationModel): Promise<string> | null {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  }
}