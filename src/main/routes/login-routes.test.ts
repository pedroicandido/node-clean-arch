import request from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hashSync } from 'bcrypt';

describe("Login routes", () => {
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

  describe("Post /signup", () => {
    test('Should return an account on success', async () => {
      await request(app).post('/api/signup').send({ name: 'Pedro', email: 'pedro@mail.com', password: '123', passwordConfirmation: '123' }).expect(200)
    })
  })

  describe("Post /login", () => {
    test('Should return 200 on login', async () => {
      const password = hashSync('123', 12)
      await accountCollection.insertOne({ name: 'Pedro', email: 'pedro@mail.com', password })
      await request(app).post('/api/login').send({ email: 'pedro@mail.com', password:'123' }).expect(200)
    })

    test('Should return 401 if user not find', async () => {
      await request(app).post('/api/login').send({ email: 'pedro@mail.com', password:'123' }).expect(401)
    })
  })
})