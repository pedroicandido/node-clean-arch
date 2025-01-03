import { ValidationComposite } from "../../../presentation/helper/validators/validation-composite";
import { RequiredFieldValidation } from "../../../presentation/helper/validators/required-field-validation";
import { IValidation } from "../../../presentation/helper/validators/validation";
import { CompareFieldsValidation } from "../../../presentation/helper/validators/compare-fields-validation";
import { EmailValidation } from "../../../presentation/helper/validators/email-validation";
import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter";

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