import MongoHelper from "./mongo-helper"

describe('Mongo Helper', () => {

  const mongoDbInstance = MongoHelper.getInstance();


  beforeAll(async () => {
    await mongoDbInstance.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await mongoDbInstance.close()
  })

  test('Should reconnect if mongo db is down', async () => {
    let accountCollection = await mongoDbInstance.getCollection('accounts')
    expect(accountCollection).toBeTruthy();
    await mongoDbInstance.close()
    accountCollection = await mongoDbInstance.getCollection('accounts')
    expect(accountCollection).toBeTruthy();
  })
})