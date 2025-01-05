import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'any_token'
}))

describe('Jwt adapter', () => {
  test('Should call sign with correct values', () => {
    const sut = new JwtAdapter('secret');
    const jwtSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('any_id')
    expect(jwtSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  test('Should return a token on sign success', () => {
    const sut = new JwtAdapter('secret');
    const token = sut.encrypt('any_id')
    expect(token).toBe('any_token');
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret');
    jest.spyOn(jwt, 'sign').mockImplementation(() => Promise.reject(new Error()))
    const token = sut.encrypt('any_id')
    await expect(token).rejects.toThrow();
  })
})