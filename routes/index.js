const express = require('express');
const dbMongoose = require('mongoose');
const router = express.Router();

// __ dbMongoose ________________________________________
const dbLogin = "admin";
const dbPassword = "test83";
const dbName = "trace_db";
const dbServer = "ds024748.mlab.com:24748";
const dbURI = `mongodb://${dbLogin}:${dbPassword}@${dbServer}/${dbName}`;
const options = {
  server: {
    socketOptions: {
      connectTimeoutMS: 5000
    }
  }
};

// Connexion à la base
const dbOptions = { useNewUrlParser: true }
dbMongoose.connect(dbURI, dbOptions, function (err) {
  if (err) {
    console.log("MongoDb URI: " + dbURI);
    console.log("Connection error to MongoDb", err);
    throw err;
  } else {
    console.log("MongoDb URI: " + dbURI);
    console.log(`Connected to mongodb...`);
  }
});
// __ dbMongoose ________________________________________

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'TRACE REST API 0.1' });
// });

module.exports = router;
