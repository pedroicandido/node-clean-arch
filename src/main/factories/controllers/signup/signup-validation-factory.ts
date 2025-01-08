import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from "../../../../presentation/helper/validators";
import { IValidation } from "../../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../../adapters/validators/email-validator-adapter";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}