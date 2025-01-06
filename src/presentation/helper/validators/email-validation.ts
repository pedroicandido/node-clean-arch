import { InvalidParamError } from "../../errors";
import { IEmailValidator } from "../../protocols/email-validator";
import { IValidation } from "../../protocols/validation";

export class EmailValidation implements IValidation {

  constructor(private readonly fieldName: string, private readonly emailValidator: IEmailValidator,) {}
  
  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValidEmail) {
      return new InvalidParamError(this.fieldName)
    }
  }
}