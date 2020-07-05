import request from 'supertest'
import app from '../../config/app'

describe('CONTENT-TYPE', () => {
  test('Should return default content-type json', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'lucas',
        email: 'lucas@lucas.com.br',
        password: '123',
        passwordConfigm: '123'
      })
      .expect(200)
  })
})
