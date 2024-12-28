import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

test('Should call bcrypt with correct value', () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  const hasSpy = jest.spyOn(bcrypt, 'hashSync')
  sut.encrypt('any_value')
  expect(hasSpy).toHaveBeenCalledWith('any_value', salt)
})