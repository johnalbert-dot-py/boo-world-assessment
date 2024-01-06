"use strict";

const request = require('supertest');
const app = require('../app');
const User = require('../models/User.model');
const Profile = require('../models/Profile.model');
const Vote = require('../models/Vote.model');
const { User1, User2, TestProfile, TestVoteByUser1, TestVoteByUser2 } = require('./helper');
const { } = require('../services/vote.service');

// jest.setTimeout(15000);

describe("POST /votes/a-martinez", () => {

  afterAll(async () => {
    app.emit('close');
    await Profile.deleteMany({}).exec();
    await User.deleteMany({}).exec();
    await Vote.deleteMany({}).exec();
  });
  
  beforeAll(async () => {
    await new Profile(TestProfile).save();
    await new User(User1).save();
  })

  it(`should return an empty votes for 'a-martinez'`, (done) => {
    request(app)
      .get('/votes/a-martinez')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.votes.length).toBe(0);
      })
      .end(function(err, res) {
        if (err) throw err;
      });
    done();
  })

  test(`should create vote for 'a-martinez' from 'Elon Musk'`, (done) => {
    request(app)
      .post('/votes/a-martinez')
      .send(TestVoteByUser1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        let vote = res.body.vote;
        expect(vote.__v).toBe(0);
        expect(vote.title).toBe("A Martinez's profile is good");
        expect(vote.comment).toBe('I like this profile!');
      })
      .end(function(err, res) {
        console.log(res.text)
        done();
        if (err) throw err;
      });

  })

})

describe("GET /votes/a-martinez?filter=", () => {
  
    afterAll(async () => {
      app.emit('close');
      await Profile.deleteMany({}).exec();
      await User.deleteMany({}).exec();
      await Vote.deleteMany({}).exec();
    });
    
    beforeAll(async () => {
      await new Profile(TestProfile).save();
      await new User(User1).save();
      await new User(User2).save();
    })
    
      
    test(`should create vote for 'a-martinez' from 'Elon Musk'`, (done) => {
      request(app)
        .post('/votes/a-martinez')
        .send(TestVoteByUser1)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          let vote = res.body.vote;
          expect(vote.__v).toBe(0);
          expect(vote.title).toBe("A Martinez's profile is good");
          expect(vote.comment).toBe('I like this profile!');
          expect(vote.mbti).toBeUndefined();
          expect(vote.enneagram).toBeUndefined();
          expect(vote.zodiac).toBeUndefined();
        })
        .end(function(err, res) {
          console.log(res.text)
          if (err) throw err;
          done();
        });
    })

    test(`should create vote for 'a-martinez' from 'Jeff Bezos'`, (done) => {
      request(app)
        .post('/votes/a-martinez')
        .send(TestVoteByUser2)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          let vote = res.body.vote;
          expect(vote.__v).toBe(0);
          expect(vote.title).toBe("Just not an INTJ");
          expect(vote.comment).toBe("I dont't think he is an INTJ based on his profile and the way he talks.");
          expect(vote.mbti).toBeUndefined();
          expect(vote.enneagram).toBeUndefined();
          expect(vote.zodiac).toBeUndefined();

        })
        .end(function(err, res) {
          console.log(res.text)
          if (err) throw err;
          done();
        });
    })

    test(`should create vote for 'a-martinez' from 'Jeff Bezos' with all params`, (done) => {

      const params = {
        mbti: 'ISFP',
        enneagram: '5w6',
        zodiac: 'virgo',
      }

      request(app)
        .post('/votes/a-martinez')
        .send({...TestVoteByUser2, ...params, title: "Maybe an ISFP?"})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          let vote = res.body.vote;
          expect(vote.__v).toBe(0);
          expect(vote.title).toBe("Maybe an ISFP?");
          expect(vote.comment).toBe("I dont't think he is an INTJ based on his profile and the way he talks.");
          expect(vote.mbti).toBe(params.mbti);
          expect(vote.enneagram).toBe(params.enneagram);
          expect(vote.zodiac).toBe(params.zodiac);
        })
        .end(function(err, res) {
          console.log(res.text)
          if (err) throw err;
          done();
        });
    })

    test(`should create vote for 'a-martinez' from 'Elon Musk' with enneagram param only`, (done) => {

      const params = {
        enneagram: '5w6',
      }

      request(app)
        .post('/votes/a-martinez')
        .send({...TestVoteByUser1, ...params, title: "Notice the 5w6?", comment: "Give 5w6 because of his profile and the way he talks."})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          let vote = res.body.vote;
          expect(vote.__v).toBe(0);
          expect(vote.title).toBe("Notice the 5w6?");
          expect(vote.comment).toBe("Give 5w6 because of his profile and the way he talks.");
          expect(vote.mbti).toBeUndefined();
          expect(vote.enneagram).toBe(params.enneagram);
          expect(vote.zodiac).toBeUndefined();
        })
        .end(function(err, res) {
          console.log(res.text)
          if (err) throw err;
          done();
        });
    })

    test(`should return only 2 votes because of filter 'enneagram'`, (done) => {
      request(app)
        .get('/votes/a-martinez?filter=enneagram')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.votes.length).toBe(2);
        })
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
    })

    test(`should return only 1 vote because of filter 'mbti'`, (done) => {
      request(app)
        .get('/votes/a-martinez?filter=mbti')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(res => {
          expect(res.body.success).toBe(true);
          expect(res.body.votes.length).toBe(1);
        })
        .end(function(err, res) {
          if (err) throw err;
          done();
        });
    })
})

describe("GET /votes/a-martinez/{vote_id}/{action: like|dislike}", () => {

  let vote1;
  let vote2;
  let user1;
  let user2;

  afterAll(async () => {
    app.emit('close');
    await Profile.deleteMany({}).exec();
    await User.deleteMany({}).exec();
    await Vote.deleteMany({}).exec();
  });
  
  beforeAll(async () => {
    await new Profile(TestProfile).save();
    user1 = await new User(User1).save();
    user2 = await new User(User2).save();
    vote1 = await new Vote({...TestVoteByUser1, profile: 'a-martinez'}).save();
    vote2 = await new Vote({...TestVoteByUser2, profile: 'a-martinez'}).save();
  })

  test(`should return 404 for invalid vote_id`, (done) => {
    request(app)
      .post('/votes/6598c2fc4a4b95bc5863f602/like') // random id
      .send({by: "random name"})
      .expect('Content-Type', /json/)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('Vote not found');
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  });

  test(`should return 404 for invalid user`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: "random name"})
      .expect('Content-Type', /json/)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('User not found');
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  });

  test(`should return success for 'Jeff Bezos' liking vote from 'Elon Musk`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: user2.name})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.result.likes.length).toBe(1);
        expect(res.body.result.by).toBe(user1._id.toString());
        expect(res.body.result.likes[0]).toBe(user2._id.toString());
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  })

  test(`should return success for 'Jeff Bezos' liking vote from 'Jeff Bezos`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: user1.name})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.result.likes.length).toBe(2);
        expect(res.body.result.by).toBe(user1._id.toString());
        expect(res.body.result.likes[1]).toBe(user1._id.toString());
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  })
  
  test(`should return error for Invalid User liking vote from 'Jeff Bezos`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: "random name"})
      .expect('Content-Type', /json/)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe("User not found");
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  })

  test(`should return success for 'Jeff Bezos' unliking vote from 'Jeff Bezos`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/dislike`)
      .send({by: user1.name})
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        expect(res.body.success).toBe(true);
        expect(res.body.result.likes.length).toBe(1);
        expect(res.body.result.by).toBe(user1._id.toString());
        expect(res.body.result.likes[0]).toBe(user2._id.toString());
      })
      .end(function(err, res) {
        console.log(res.text)
        if (err) throw err;
        done();
      });
  })
  

})


describe("GET /votes/a-martinez?sort=", () => {
  
  let vote1;
  let vote2;
  let vote3;

  let user1;
  let user2;

  afterAll(async () => {
    app.emit('close');
    await Profile.deleteMany({}).exec();
    await User.deleteMany({}).exec();
    await Vote.deleteMany({}).exec();
  });
  
  beforeAll(async () => {
    await new Profile(TestProfile).save();
    user1 = await new User(User1).save();
    user2 = await new User(User2).save();
    vote1 = await new Vote({...TestVoteByUser1, profile: 'a-martinez'}).save();

    const getFiveSecondsDelay = () => {
      // this will set as an recent vote
      const date = new Date();
      date.setSeconds(date.getSeconds() + 5);
      return date;
    }

    vote2 = await new Vote({
      ...TestVoteByUser2,
      profile: 'a-martinez', 
      createdAt: getFiveSecondsDelay(),
      updatedAt: getFiveSecondsDelay()
    }).save();
  })

  test(`should return success for liking vote from 'Jeff Bezos'`, (done) => {
    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: user2.name})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
      });

    request(app)
      .post(`/votes/${vote1._id}/like`)
      .send({by: user1.name})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });

  })

  test(`should return 2 votes and most likes at top`, (done) => {
    request(app)
      .get('/votes/a-martinez?sort=best')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        console.log("Sorted => ", res.body.votes);
        expect(res.body.success).toBe(true);
        expect(res.body.votes.length).toBe(2);

        expect(res.body.votes[0].likes.length).toBe(2);
        expect(res.body.votes[1].likes.length).toBe(0);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  })

  test(`should return 2 votes and most recent at top`, (done) => {
    request(app)
      .get('/votes/a-martinez?sort=recent')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        console.log("Sorted most recent => ", res.body.votes);
        expect(res.body.success).toBe(true);
        expect(res.body.votes.length).toBe(2);

        expect(res.body.votes[0].likes.length).toBe(0);
        expect(res.body.votes[1].likes.length).toBe(2);
      })
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  })
})

