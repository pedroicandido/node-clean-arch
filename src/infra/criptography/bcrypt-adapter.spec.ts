import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hashSync: () => 'hash'
}))

test('Should call bcrypt with correct value', () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  const hasSpy = jest.spyOn(bcrypt, 'hashSync')
  sut.encrypt('any_value')
  expect(hasSpy).toHaveBeenCalledWith('any_value', salt)
})

test('Should return a hash on success', () => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  const hash = sut.encrypt('any_value')
  expect(hash).toBe('hash')
})