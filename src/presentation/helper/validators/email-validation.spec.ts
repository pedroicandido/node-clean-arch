import { InvalidParamError } from "../../errors";
import { IEmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";
import { IValidation } from "./validation";

interface SutType {
  sut: IValidation;
  emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub();
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email validation', () => {

  test("Should call email validator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: "any_email@mail.com" })
    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com")
  })

  test("Should return an error if email is not valid", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: "any_email@mail.com" })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test("Should return 500 if email validator throws", async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(sut.validate).toThrow();
  })
})