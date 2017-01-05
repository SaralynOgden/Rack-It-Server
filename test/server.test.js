'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const app = require('../server');
const supertest = require('supertest');

suite('rack routes', () => {
  test('GET /racks//:', (done) => {
    supertest(app)
      .get('/binary')
      .expect(200, '0')
      .expect('Content-Type', /json/)
      .end(done);
  });
});
