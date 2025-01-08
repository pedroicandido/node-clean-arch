import { ValidationComposite, RequiredFieldValidation, EmailValidation } from "../../../../validation/validators";
import { IValidation } from "../../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../../../infra/validators/email-validator-adapter";
export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}