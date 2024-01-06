"use strict"

const request = require('supertest');
const app = require('../app');
const Profile = require('../models/Profile.model');

const slugify = require('slugify');

const { TestProfile, User1, User2 } = require('./helper');
const mongoose = require('mongoose');

console.error = message => {};

describe("GET /profile", () => {

  test("should return 404", async () => {
    const response = await request(app)
      .get('/profile')
    expect(response.statusCode).toBe(404)
  })

})

describe("POST /profile", () => {


  afterEach(async () => {
    await Profile.deleteMany({}).exec();
    app.emit('close');
  });

  it("should return new Profile", (done) => {
    request(app)
      .post('/profile')
      .send(TestProfile)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        let profile = res.body.profile;
        expect(profile.__v).toBe(0);
        expect(profile.name).toBe(TestProfile.name);
        expect(profile.description).toBe(TestProfile.description);
        expect(profile.mbti).toBe(TestProfile.mbti);
        expect(profile.enneagram).toBe(TestProfile.enneagram);
        expect(profile.variant).toBe(TestProfile.variant);
        expect(profile.tritype).toBe(TestProfile.tritype);
        expect(profile.socionics).toBe(TestProfile.socionics);
        expect(profile.sloan).toBe(TestProfile.sloan);
        expect(profile.psyche).toBe(TestProfile.psyche);
      })
      .end(function(err, res) {
        if (err) throw err;
      });
    done()
  })

})

describe("POST /profile", () => {

  it("should slug the name for identification", (done) => {
    request(app)
      .post('/profile')
      .send(TestProfile)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        let profile = res.body.profile;
        expect(profile.slug).toBe(slugify(TestProfile.name, { lower: true }));
      })
      .end(function(err, res) {
        if (err) throw err;
      });
    done()

  })

})

describe("GET /profile/:profile", () => {
  
  afterEach(async () => {
    await Profile.deleteMany({}).exec();
    app.emit('close');
  })

  beforeEach(async () => {
    // lets just add 's' for now for uniqueness of slug
    await Profile.create({...TestProfile, name: 'A Martinezs'});
  });

  it("should return profile for 'A Martinezs'", async () => {
    const response = await request(app)
      .get('/profile/a-martinezs')
    expect(response.statusCode).toBe(200)
    expect(response.text).toMatch(/A Martinezs/)
    expect(response.text).toMatch(/Adolph Larrue Martinez III/)
  })
    
})




