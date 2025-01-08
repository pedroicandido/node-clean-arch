import SignUpController from "../../../../presentation/controllers/signup/signup-controller";
import { IController } from "../../../../presentation/protocols";
import { makeSignUpValidation } from "./signup-validation-factory";
import { makeAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeDbAddAccount } from "../../usecases/add-account/db-add-account-factory";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";

export const makeSignupController = (): IController => {
  const dbAuthentication = makeAuthentication();
  const addAccount = makeDbAddAccount();
  const signUpController = new SignUpController(addAccount, makeSignUpValidation(), dbAuthentication);
  return makeLogControllerDecorator(signUpController);
}