import { ILogErrorRepository } from "../../../../data/protocols/db/log/log-error-repository";
import MongoHelper from "../helpers/mongo-helper";

export class LogMongoRepository implements ILogErrorRepository {
  
  constructor(private readonly mongoInstance: MongoHelper) {}

  async logError(stack: string): Promise<void> {
    const errorCollection = await this.mongoInstance.getCollection('errors')
    await errorCollection.insertOne({ stack, date: new Date() })
  }
}