import jwt from 'jsonwebtoken'
import { IEncrypter } from "../../../data/protocols/criptography";

export class JwtAdapter implements IEncrypter {
  private readonly secret: string;
  constructor(secret: string) {
    this.secret = secret;
  }

  encrypt(value: string): string {
    jwt.sign({ id: value }, this.secret)
    return null;
  }

}