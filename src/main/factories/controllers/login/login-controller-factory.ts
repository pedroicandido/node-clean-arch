import { LoginController } from "../../../../presentation/controllers/login/login-controller";
import { IController } from "../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../decorators/log-controller-decorator-factory";
import { makeAuthentication } from "../../usecases/authentication/db-authentication-factory";
import { makeLoginValidation } from "./login-validation-factory";


export const makeLoginController = (): IController => {
  const dbAuthentication = makeAuthentication();
  const loginController = new LoginController(makeLoginValidation(), dbAuthentication);
  return makeLogControllerDecorator(loginController);
}