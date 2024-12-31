import { ILogErrorRepository } from "../../../../data/protocols/log-error-repository";
import MongoHelper from "../helpers/mongo-helper";

export class LogMongoRepository implements ILogErrorRepository {
  private readonly mongoInstance: MongoHelper;
  constructor(mongoInstance: MongoHelper) {
    this.mongoInstance = mongoInstance;
  }
  async logError(stack: string): Promise<void> {
    const errorCollection = await this.mongoInstance.getCollection('errors')
    await errorCollection.insertOne({ stack, date: new Date() })
  }
}