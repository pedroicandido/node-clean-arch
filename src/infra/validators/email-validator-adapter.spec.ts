import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

test('Should return false if validator returns false', () => {
  const sut = new EmailValidatorAdapter();
  jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
  const isValid = sut.isValid('invalid_email@mail.com')
  expect(isValid).toBe(false)
})

test('Should return true if validator returns true', () => {
  const sut = new EmailValidatorAdapter();
  const isValid = sut.isValid('invalid_email@mail.com')
  expect(isValid).toBe(true)
})

test('Should call validator with correct value', () => {
  const sut = new EmailValidatorAdapter();
  const isEmailSpy = jest.spyOn(validator, 'isEmail')
  sut.isValid('invalid_email@mail.com')
  expect(isEmailSpy).toHaveBeenCalledWith('invalid_email@mail.com')
})