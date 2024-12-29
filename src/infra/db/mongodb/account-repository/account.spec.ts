import MongoHelper from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account  mongo repository', () => {
  const mongoDbInstance = MongoHelper.getInstance();
  beforeAll(async () => {
    await mongoDbInstance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoDbInstance.close();
  });

  beforeEach(async()=>{
    const accountCollection = mongoDbInstance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })



  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository(mongoDbInstance)
    const account = await sut.add({
      name: "any_name",
      email: 'any_email',
      password: 'hashed_password'
    })
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('hashed_password')
  })
})