import { startService } from '..'
import axios from 'axios'
import { internet } from 'faker'
import { registerEndpoint, password } from './generic/constants'

beforeAll(async () => {
  await startService()
})

test('It should not allow an empty password', async () => {
  const email = internet.email()
  try {
    await axios.post(registerEndpoint, { email })
  } catch (error) {
    expect(error.response.status).toBe(400)
  }
})

test('It should not allow an empty email', async () => {
  try {
    await axios.post(registerEndpoint, { password })
  } catch (error) {
    expect(error.response.status).toBe(400)
  }
})

test('It should not allow duplicate emails', async () => {
  const email = internet.email()
  const res1 = await axios.post(registerEndpoint, { password, email })
  expect(res1.status).toBe(201)
  try {
    await axios.post(registerEndpoint, { password, email })
  } catch (error: any) {
    expect(error.response.status).toBe(400)
  }
})

test('It should register a user', async () => {
  const email = internet.email()
  const res = await axios.post(registerEndpoint, { email, password })
  expect(res.status).toBe(201)
})
