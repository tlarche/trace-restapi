// var request = require('request')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// __ USER SCHEMA ________________________________________
const ObjectId = mongoose.Schema.Types.ObjectId
const userSchema = mongoose.Schema({
  user_id: ObjectId,
  first_name: String,
  last_name: String,
  country: String,
  language: String,
  email: String,
  user_status: String,
  created_date: Date,
  updated_date: Date
})
const UserModel = mongoose.model('user', userSchema)
// __ USER SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function ( req, res, next) {
  console.log('ROUTE: user/create', req.body)

  // Check if USER exist?
  UserModel.findOne({ email: req.body.email }, function ( err, user) {
    if ( user ) {
      // this USER exists, can't create
      console.log(`>>> user already exists (email: ${req.body.email}) <<<`)
      console.log('user: ', user)
      res.json({
        '_id': user._id,
        'result': false
      })

    } else {

      // This user doesn't exist...
      const createdDate = new Date()
      const newUser = new UserModel({
        // user_id: Number,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        country: req.body.country,
        language: req.body.language,
        email: req.body.email,
        user_status: 'active',
        created_date: createdDate,
        updated_date: ''
      })

      // Create new user
      newUser.save(function ( err, user ) {
        if ( err === null ) {
          console.log('CREATE: OK')
          res.json({ user, 'result': true })
        } else {
          console.log('CREATE: error', err)
          res.json({ err, 'result': false })
        }
      }) // end save
    } // end else
  }) // end findOne 

// END ROUTE => CREATE-USER
})

/* GET=READ */
router.get('/read', function (req, res, next) {
  console.log('ROUTE: user/read', req.query)
  UserModel.findById(req.query.user_id, function (err, user) {
    console.log('error:', err)
    if (user !== null) {
      // USER found => return it
      res.json({
        user,
        result: true
      })
    } else {
      // USER is not found => return false
      res.json({
        user: null,
        result: false
      })
    }
  })
})

// GETS A SINGLE USER FROM THE DATABASE
router.get('/id/:id', function (req, res) {
  console.log(`ROUTE: user/id/ ${req.params.id}`)

  UserModel.findById(req.params.id, function (err, user) {
    if ( err ) {
      let errorMsg = `There was a problem finding this user ${req.params.id}.`
      errorMsg += `\n` + err.message
      return res.status(500).send(errorMsg)
    }
    if ( !user ) {
      return res.status(404).send(`No user found for ${req.params.id}.`)
    } else {
      res.status(200).send(user)
    }
  })
})

// GETS A SINGLE USER FROM THE DATABASE BY ITS EMAIL
router.get('/email/:email', function (req, res) {
  console.log(`ROUTE: user/email/${req.params.email}`)
  UserModel.findOne(
    {email: req.params.email}
    , function (err, user) {
      if (err) {
        let errorMsg = `There was a problem finding this user ${req.params.email}.`
        errorMsg += `\n` + err.message
        return res.status(500).send(errorMsg)
      }
      if (!user) {
        return res.status(404).send(`No user found for ${req.params.email}.`)
      } else {
        return res.status(200).send(user)
      }
    })
})

/* DELETE=USER BY USER_ID */
router.delete('/delete', function (req, res, next) {
  console.log('ROUTE: user/delete', req.query.user_id)

  UserModel.findOne({ _id: req.query.user_id }, function (error, user) {
    console.log(user)
    console.log(`user ${req.query.user_id} has been deleted...`)
    res.status(404).send('...')
  })

  // END ROUTE => DELETE-USER
})
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('ROUTE: user/', req.body)
  res.json({message: 'route user/'})
})

module.exports = router
