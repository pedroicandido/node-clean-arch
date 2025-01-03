import { IHasher } from "../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  hash(value: string): string {
    return bcrypt.hashSync(value, this.salt);
  }
}