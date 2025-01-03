import { InvalidParamError } from "../../errors";
import { IValidation } from "../../protocols/validation";

export class CompareFieldsValidation implements IValidation {
  private readonly fieldName: string;
  private readonly fieldToCompare: string;
  constructor(fieldName: string, fieldToCompare: string) {
    this.fieldName = fieldName;
    this.fieldToCompare = fieldToCompare;
  }
  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare)
    }
  }
}