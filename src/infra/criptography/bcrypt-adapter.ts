import { IEncrypter } from "../../data/protocols/criptography/encrypter";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  encrypt(value: string): string {
    return bcrypt.hashSync(value, this.salt);
  }
}