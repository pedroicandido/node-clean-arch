import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';

describe("Signup routes", () => {
  const mongoDbInstance = MongoHelper.getInstance();
  beforeAll(async () => {
    await mongoDbInstance.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoDbInstance.close();
  });

  beforeEach(async () => {
    const accountCollection = mongoDbInstance.getCollection('accounts')
    await accountCollection.deleteMany({})
  })


  test('Should return an account on success', async () => {
    await request(app).post('/api/signup').send({ name: 'Pedro', email: 'pedro@mail.com', password: '123', passwordConfirmation: '123' }).expect(200)
  })
})