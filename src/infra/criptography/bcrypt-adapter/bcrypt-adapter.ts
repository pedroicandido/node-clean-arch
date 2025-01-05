import { IHashCompare } from "../../../data/protocols/criptography";
import { IHasher } from "../../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher, IHashCompare {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid;
  }

  hash(value: string): string {
    return bcrypt.hashSync(value, this.salt);
  }
}