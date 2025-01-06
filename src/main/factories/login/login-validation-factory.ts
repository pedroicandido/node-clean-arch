import { ValidationComposite, RequiredFieldValidation, EmailValidation } from "../../../presentation/helper/validators/"
import { IValidation } from "../../../presentation/protocols/validation";
import { EmailValidatorAdapter } from "../../adapters/validators/email-validator-adapter";
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