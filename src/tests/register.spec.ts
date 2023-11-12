import * as request from 'supertest'
import { internet } from 'faker'
import { registerEndpoint, password } from './generic/constants'
import { app } from '../index.js'

let http: request.SuperTest<request.Test>

beforeAll(() => {
  http = request(app)
})
test('It should not allow an empty password', async () => {
  const email = internet.email()
  const res = await http.post(registerEndpoint).send({ email })
  expect(res.status).toBe(400)
})
test('It should not allow an empty email', async () => {
  const res = await http.post(registerEndpoint).send({ password })
  expect(res.status).toBe(400)
})

test('It should not allow duplicate emails', async () => {
  const email = internet.email()
  const res1 = await http.post(registerEndpoint).send({ password, email })
  expect(res1.status).toBe(201)
  const res = await http.post(registerEndpoint).send({ password, email })
  expect(res.status).toBe(400)
})

test('It should register a user', async () => {
  const email = internet.email()
  const res = await http.post(registerEndpoint).send({ email, password })
  expect(res.status).toBe(201)
})
