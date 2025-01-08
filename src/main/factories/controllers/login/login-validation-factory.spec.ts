
import { IValidation } from "../../../../presentation/protocols/validation"; 
import { IEmailValidator } from "../../../../validation/protocols/email-validator";
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from "../../../../validation/validators";
import { makeLoginValidation } from "./login-validation-factory"

jest.mock("../../../../validation/validators/validation-composite")

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub();
}


test('Should call validation composite with all validations', () => {
  makeLoginValidation();
  const validations: IValidation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', makeEmailValidator()))
  expect(ValidationComposite).toHaveBeenCalledWith(validations)
})