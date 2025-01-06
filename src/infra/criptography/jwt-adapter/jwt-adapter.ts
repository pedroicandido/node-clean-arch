import jwt from 'jsonwebtoken'
import { IEncrypter } from "../../../data/protocols/criptography";

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) {}

  encrypt(value: string): string {
    const token = jwt.sign({ id: value }, this.secret)
    return token;
  }

}