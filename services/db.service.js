"use strict"

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-global');

async function getServer( ) {
  const serverConnection = await MongoMemoryServer.create();
  try {
    return serverConnection;
  } catch (error) {
    console.error(error);
  }
}

async function dbConnection(server = null) {
  const uri = server ? await server?.getUri() : await MongoMemoryServer.create();
  try {
    return await mongoose.connect(uri.getUri());
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  dbConnection,
  getServer,
};
