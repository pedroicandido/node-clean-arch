import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';
import { LogMongoRepository } from './log-repository';

describe('Log mongo repository', () => {
  const mongoDbInstance = MongoHelper.getInstance();
  let errorsCollection: Collection;
  beforeAll(async () => {
    await mongoDbInstance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoDbInstance.close();
  });

  beforeEach(async () => {
    errorsCollection = await mongoDbInstance.getCollection('errors')
    await errorsCollection.deleteMany({})
  })


  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository(mongoDbInstance);
    await sut.logError('any_error')
    const count = await errorsCollection.countDocuments();
    expect(count).toBe(1)
  })
})