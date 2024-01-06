'use strict';

const express = require('express');
const app = express();
const port =  process.env.PORT || 3000;
const { dbConnection } = require('./services/db.service');

// set the view engine to ejs
app.set('view engine', 'ejs');

// add middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/votes', require('./routes/vote')()); // new vote route
app.use('/profile', require('./routes/profile')()); // update profile route
app.use('/user', require('./routes/user')()); // new user route

// start server
const db = dbConnection()

const server = app.listen(port);
console.log('Express started. Listening on %s', port);


app.on('close', () => {
  server.close();
})

// expose app
module.exports = app;
