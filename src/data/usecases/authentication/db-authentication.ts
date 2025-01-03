
import { AuthenticationModel, IAuthentication } from "../../../domain/usecases/authentication";
import { IHashCompare, ITokenGenerator } from "../../protocols/criptography";
import { ILoadAccountEmailByRepository } from "../../protocols/db/load-account-email-by-repository";
import { IUpdateTokenRepository } from "../../protocols/db/update-token-repository";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountEmailByRepository;
  private readonly hashComparer: IHashCompare;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly updateTokenRepository: IUpdateTokenRepository;

  constructor(loadAccountByEmailRepository: ILoadAccountEmailByRepository, hashComparer: IHashCompare, tokenGenerator: ITokenGenerator, updateTokenRepository: IUpdateTokenRepository) {
    this.updateTokenRepository = updateTokenRepository;
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
        await this.updateTokenRepository.update(account.id, token)
        return token;
      }

    }
    return null;
  }
}