import { RequiredFieldValidation } from "../../presentation/helper/validators/required-field-validation";
import { IValidation } from "../../presentation/helper/validators/validation";
import { ValidationComposite } from "../../presentation/helper/validators/validation-composite";
import { makeSignUpValidation } from "./signup-validation"

jest.mock("../../presentation/helper/validators/validation-composite")

test('Should call validation composite with all validations', () => {
  makeSignUpValidation();
  const validations: IValidation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }
  expect(ValidationComposite).toHaveBeenCalledWith(validations)
})