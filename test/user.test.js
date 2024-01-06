"use strict";

const request = require('supertest');
const app = require('../app');
const User = require('../models/User.model');
const { User1, User2 } = require('./helper');

console.error = message => {};

afterEach(async () => {
  app.emit('close');
  await User.deleteMany({}).exec();
});

describe("POST /user", () => {

  it("should create user for 'Elon Musk'", () => {
    request(app)
      .post('/user')
      .send(User1)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        let user = res.body.user;
        expect(user.__v).toBe(0);
        expect(user.name).toBe('Elon Musk');
      })
      .end(function(err, res) {
        if (err) throw err;
      });
  })

  it("should create user for 'Jeff Bezos'", () => {
    request(app)
      .post('/user')
      .send(User2)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        let user = res.body.user;
        expect(user.__v).toBe(0);
        expect(user.name).toBe('Jeff Bezos');
      })
      .end(function(err, res) {
        if (err) throw err;
      });
  })

  it("should return error for missing 'name'", () => {
    request(app)
      .post('/user')
      .send({})
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .expect((res) => {
        let success = res.body.success;
        expect(success).toBe(false);
      })
      .end(function(err, res) {
        if (err) throw err;
      });
  });
})
