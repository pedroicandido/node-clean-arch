import {
  AuthenticationModel,
  IAuthentication,
  IHashCompare,
  IEncrypter,
  ILoadAccountEmailByRepository,
  IUpdateTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements IAuthentication {


  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountEmailByRepository,
    private readonly hashComparer: IHashCompare,
    private readonly encrypter: IEncrypter,
    private readonly updateTokenRepository: IUpdateTokenRepository
  ) { }

  async auth(authentication: AuthenticationModel): Promise<string> | null {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const token = this.encrypter.encrypt(account.id)
        await this.updateTokenRepository.updateToken(account.id, token)
        return token;
      }

    }
    return null;
  }
}