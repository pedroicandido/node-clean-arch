import { MissingParamError } from "../../errors"
import { IValidation } from "../../protocols/validation"
import { ValidationComposite } from "./validation-composite"

interface SutTypes {
  validationStubs: IValidation[];
  sut: ValidationComposite;
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }
  const validationStub = new ValidationStub()
  return validationStub;
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs)
  return {
    validationStubs, sut
  }
}



describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should return falsy if validations succeds', () => {
    const { sut, } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy();
  })

})