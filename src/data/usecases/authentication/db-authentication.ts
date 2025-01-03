
import { AuthenticationModel, IAuthentication } from "../../../domain/usecases/authentication";
import { IHashCompare, ITokenGenerator } from "../../protocols/criptography";
import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountEmailByRepository;
  private readonly hashComparer: IHashCompare;
  private readonly tokenGenerator: ITokenGenerator;

  constructor(loadAccountByEmailRepository: ILoadAccountEmailByRepository, hashComparer: IHashCompare, tokenGenerator: ITokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth(authentication: AuthenticationModel): Promise<string> | null {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const token = await this.tokenGenerator.generate(account.id)
        return token;
      }

    }
    return null;
  }
}