import MongoHelper from '..//infra/db/mongodb/helpers/mongo-helper';
import env from "./config/env";
import app from "./config/app";

const mongoDbInstance = MongoHelper.getInstance();

mongoDbInstance.connect(env.mongoUrl).then(() => {
  app.listen(env.port, () => console.log(`Server runing at http://localhost:${env.port}`))
}).catch(console.error);




