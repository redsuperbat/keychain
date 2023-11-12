import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import {
  loginEndpoint,
  registerEndpoint,
  password,
} from './generic/constants.js';
import { after, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { server } from '../src/index.js';

const serverInstance = server.start(4001);
const http = supertest.agent(serverInstance);

after(async () => {
  await new Promise((res) => serverInstance.close(res));
});

test('It should return 400 if email does not exist', async () => {
  const email = faker.internet.email();
  const res = await http.post(loginEndpoint).send({ email });
  assert.equal(res.status, 400);
});
test('On successful login it should return 200 and user data', async () => {
  const email = faker.internet.email();
  await http.post(registerEndpoint).send({ email, password });
  await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for one second
  const res = await http.post(loginEndpoint).send({ email, password });
  assert.equal(res.status, 200);
  assert.ok(res.body);
});
