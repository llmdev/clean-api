import request from 'supertest'
import app from './../config/app'

describe('Signup Routes', () => {
  test('Should return an account on succes', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Lucas',
        email: 'lucasmoura.dev@gmail.com',
        password: '123',
        passwordConfirm: '123'
      })
      .expect(200)
  })
})
