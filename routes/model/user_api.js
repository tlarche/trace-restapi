// var request = require('request');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// __ USER SCHEMA ________________________________________
const userSchema = mongoose.Schema({
  user_id: Number,
  first_name: String,
  last_name: String,
  country: String,
  language: String,
  email: String,
  user_status: String,
  created_date: Date,
  updated_date: Date
  });
const userModel = mongoose.model("user", userSchema);
// __ USER SCHEMA ________________________________________

/*
==============  
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function( req, res, next) {
  console.log("ROUTE: user/create", req.body);
  
  // Check if USER exist?
  userModel.findOne({ email: req.body.email }, function( err, user) {
    if ( user ) {
      
      // this USER exists, can't create
      console.log(`>>> user already exists (email: ${req.body.email}) <<<`);
      console.log("user: ", user)
      res.json({
        "_id": user._id,
        "result": false
      });

    } else {

      // This user doesn't exist...
      const createdDate = new Date(); 
      const newUser = new userModel({
        // user_id: Number,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        language: req.body.language,
        email: req.body.email,
        user_status: "active",
        created_date: createdDate,
        updated_date: ""
      });
      
      // Create new user
      newUser.save(function( error, user ) {
        if ( err === null ) {
          console.log("CREATE: OK");
          res.json({ user, "result":true });
        } else {
          console.log("CREATE: error", err);
          res.json({ err, "result":false });
        }
      }); // end save
    } // end else
  }); // end findOne 

// END ROUTE => CREATE-USER
});

/* GET=READ */
router.get('/read', function (req, res, next) {
  console.log("ROUTE: user/read", req.query);
  userModel.findById(req.query.user_id, function (err, user) {
    console.log("error:", err);
    if (user !== null) {

      // USER found => return it
      res.json({
        user,
        result: true
      });
    
    } else {

      // USER is not found => return false
      res.json({
        user: null,
        result: false
      });

    }
  });
});

/* DELETE=USER */
router.delete('/delete', function (req, res, next) {
  console.log("ROUTE: user/delete", req.query.user_id);

  userModel.findOne({ _id: req.query.user_id }, function (error, user) {
    console.log(user);
    console.log(`user ${req.query.user_id} has been deleted...`);
    res.status(404).send("...");
  });

  // END ROUTE => DELETE-USER
});
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("ROUTE: user/", req.body);
  res.json({message: 'route user/'});
});

module.exports = router;
