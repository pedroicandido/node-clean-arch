import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';
import { IEncrypter } from '../../data/protocols/encrypter';

jest.mock('bcrypt', () => ({
  hashSync: () => 'hash'
}))

const salt = 12;

const makeSut = (): IEncrypter => {
  return new BcryptAdapter(salt);
}

test('Should call bcrypt with correct value', () => {
  const sut = makeSut();
  const hasSpy = jest.spyOn(bcrypt, 'hashSync')
  sut.encrypt('any_value')
  expect(hasSpy).toHaveBeenCalledWith('any_value', salt)
})

test('Should return a hash on success', () => {
  const sut = makeSut();
  const hash = sut.encrypt('any_value')
  expect(hash).toBe('hash')
})