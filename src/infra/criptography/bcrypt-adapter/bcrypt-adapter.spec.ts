import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  hashSync: (): string => 'hash',
  compare: (): Promise<boolean> => new Promise((resolve, reject) => resolve(true))
}))

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

beforeEach(jest.clearAllMocks)

test('Should call hash method with correct value', () => {
  const sut = makeSut();
  const hasSpy = jest.spyOn(bcrypt, 'hashSync')
  sut.hash('any_value')
  expect(hasSpy).toHaveBeenCalledWith('any_value', salt)
})

test('Should return a valid hash on success', () => {
  const sut = makeSut();
  const hash = sut.hash('any_value')
  expect(hash).toBe('hash')
})


test('Should call compare with correct values', async () => {
  const sut = makeSut();
  const compareSpy = jest.spyOn(bcrypt, 'compare')
  await sut.compare('any_value', 'hash')
  expect(compareSpy).toHaveBeenCalledWith('any_value', 'hash')
})

test('Should return false is compare returns false', async () => {
  const sut = makeSut();
  jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
  const isValid = await sut.compare('any_value', 'hash')
  expect(isValid).toBe(false)
})

test('Should return true if compare succeeds', async () => {
  const sut = makeSut();
  const isValid = await sut.compare('any_value', 'hash')
  expect(isValid).toBe(true)
})




