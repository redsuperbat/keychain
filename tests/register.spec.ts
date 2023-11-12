import supertest from 'supertest';
import { registerEndpoint, password } from './generic/constants.js';
import { server } from '../src/index.js';
import { faker } from '@faker-js/faker';
import { after, test } from 'node:test';
import { strict as assert } from 'node:assert';
const serverInstance = server.start(4001);
const http = supertest.agent(serverInstance);

after(async () => {
  await new Promise((res) => serverInstance.close(res));
});
test('It should not allow an empty password', async () => {
  const email = faker.internet.email();
  const res = await http.post(registerEndpoint).send({ email });
  assert.equal(res.status, 400);
});
test('It should not allow an empty email', async () => {
  const res = await http.post(registerEndpoint).send({ password });
  assert.equal(res.status, 400);
});

test('It should not allow duplicate emails', async () => {
  const email = faker.internet.email();
  const res1 = await http.post(registerEndpoint).send({ password, email });
  assert.equal(res1.status, 201);
  const res = await http.post(registerEndpoint).send({ password, email });
  assert.equal(res.status, 400);
});

test('It should register a user', async () => {
  const email = faker.internet.email();
  const res = await http.post(registerEndpoint).send({ email, password });
  assert.equal(res.status, 201);
});
