import {
  AuthenticationModel,
  IAuthentication,
  IHashCompare,
  IEncrypter,
  ILoadAccountEmailByRepository,
  IUpdateTokenRepository,
} from "./db-authentication-protocols";

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountEmailByRepository;
  private readonly hashComparer: IHashCompare;
  private readonly encrypter: IEncrypter;
  private readonly updateTokenRepository: IUpdateTokenRepository;

  constructor(loadAccountByEmailRepository: ILoadAccountEmailByRepository, hashComparer: IHashCompare, encrypter: IEncrypter, updateTokenRepository: IUpdateTokenRepository) {
    this.updateTokenRepository = updateTokenRepository;
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.encrypter = encrypter;
  }

  async auth(authentication: AuthenticationModel): Promise<string> | null {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (account) {
      const isValid = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateTokenRepository.updateToken(account.id, token)
        return token;
      }

    }
    return null;
  }
}