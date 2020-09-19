import { startService } from '..'
import axios from 'axios'
import { internet } from 'faker'
import { loginEndpoint, registerEndpoint } from './generic/constants'

const password = 'password'

beforeAll(async () => {
  await startService()
})

test('It should return 400 if email does not exist', async () => {
  const email = internet.email()
  try {
    await axios.post(loginEndpoint, { email, password })
  } catch (error) {
    expect(error.response.status).toBe(400)
  }
})
test('On successful login it should return 200 and user data', async () => {
  const email = internet.email()
  await axios.post(registerEndpoint, { email, password })
  const res = await axios.post(loginEndpoint, { email, password })
  expect(res.status).toBe(200)
  expect(res.data).toBeInstanceOf(Object)
})
