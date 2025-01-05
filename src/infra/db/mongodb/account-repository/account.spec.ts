import { Collection } from 'mongodb';
import MongoHelper from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

describe('Account  mongo repository', () => {
  const mongoDbInstance = MongoHelper.getInstance();
  let accountCollection: Collection;
  beforeAll(async () => {
    await mongoDbInstance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoDbInstance.close();
  });

  beforeEach(async () => {
    accountCollection = await mongoDbInstance.getCollection('accounts')
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

  test('Should return an account on load by email', async () => {
    const sut = new AccountMongoRepository(mongoDbInstance)
    await accountCollection.insertOne({
      name: "any_name",
      email: 'any_email',
      password: 'hashed_password'
    })
    const account = await sut.loadByEmail('any_email')
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return null if load by email fails', async () => {
    const sut = new AccountMongoRepository(mongoDbInstance)
    const account = await sut.loadByEmail('any_email')
    expect(account).toBeNull()
  })
})