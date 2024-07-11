const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('POST /auth/register', () => {
  it('Should register user successfully with default organization', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.user.email).toEqual('john.doe@example.com');
    expect(res.body.data.user.firstName).toEqual('John');
  });

  it('Should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body.errors[0].field).toEqual('firstName');
  });
});

describe('POST /auth/login', () => {
  it('Should log the user in successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.user.email).toEqual('john.doe@example.com');
  });

  it('Should fail if credentials are incorrect', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
  });
});
