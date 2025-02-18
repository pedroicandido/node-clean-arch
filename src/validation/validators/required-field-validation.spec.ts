import { MissingParamError } from "../../presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";

interface SutType {
  sut: RequiredFieldValidation;
}
const makeSut = (): SutType => {
  const sut = new RequiredFieldValidation('field')
  return {
    sut
  }
}

describe('Required field validation', () => {

  test("Should return a missing param error if validation fails", () => {
    const { sut } = makeSut();
    const error = sut.validate({ email: "any_email@mail.com" })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test("Should return falsy if validation succeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value" })
    expect(error).toBeFalsy()
  })
})