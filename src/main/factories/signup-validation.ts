import { ValidationComposite } from "../../presentation/helper/validators/validation-composite";
import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation";
import { IValidation } from "../../presentation/helper/validators/validation";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  const validationComposite = new ValidationComposite(validations)
  return validationComposite
}