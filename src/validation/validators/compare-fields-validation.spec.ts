
import { InvalidParamError } from "../../presentation/errors";
import { CompareFieldsValidation } from "./compare-fields-validation";


interface SutType {
  sut: CompareFieldsValidation;
}
const makeSut = (): SutType => {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare')
  return {
    sut
  }
}

describe('Required field validation', () => {

  test("Should return a an invalid param error if validation fails", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "value", fieldToCompare:'other_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test("Should return falsy if validation succeds", () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value",fieldToCompare: "any_value" })
    expect(error).toBeFalsy()
  })
})