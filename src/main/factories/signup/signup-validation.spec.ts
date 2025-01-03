import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helper/validators/email-validation";
import { RequiredFieldValidation } from "../../../presentation/helper/validators/required-field-validation";
import { IValidation } from "../../../presentation/helper/validators/validation";
import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite";
import { IEmailValidator } from "../../../presentation/protocols/email-validator";
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../../presentation/helper/validators/validation-composite")

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub();
}


test('Should call validation composite with all validations', () => {
  makeSignUpValidation();
  const validations: IValidation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', makeEmailValidator()))
  expect(ValidationComposite).toHaveBeenCalledWith(validations)
})