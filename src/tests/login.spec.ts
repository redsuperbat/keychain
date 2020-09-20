import * as request from 'supertest'
import { internet } from 'faker'
import { loginEndpoint, registerEndpoint, password } from './generic/constants'
import { app } from '..'

let http: request.SuperTest<request.Test>

beforeAll(() => {
  http = request(app)
})

test('It should return 400 if email does not exist', async () => {
  const email = internet.email()
  const res = await http.post(loginEndpoint).send({ email })
  expect(res.status).toBe(400)
})
test('On successful login it should return 200 and user data', async () => {
  const email = internet.email()
  await http.post(registerEndpoint).send({ email, password })
  await new Promise((resolve) => setTimeout(resolve, 1000)) // wait for one second
  const res = await http.post(loginEndpoint).send({ email, password })
  expect(res.status).toBe(200)
  expect(res.body).toBeInstanceOf(Object)
})
