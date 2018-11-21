// Declaration
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
// const XXXX = require ('../model/step_api');
// import { ObjectId } from '../model/step_api';

// __ POI SCHEMA ________________________________________
const ObjectId = mongoose.Schema.Types.ObjectId;
const Coord_DD = mongoose.Schema({
    latitude: {
        type: Number,
        require: true
    },
    longitude: {
        type: Number,
        require: true
    },
    address: {
        full_text: String,
        country: String
    }
});

const poiSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        require: true
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: String,
    kind: String,
    link: String,
    dd_coord: Coord_DD
  });

const poiModel = mongoose.model("poi", poiSchema);
// __ poi SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function( req, res, next) {
    console.log("ROUTE: poi/create", req.body);

    // Check if POI exist?
    poiModel.findOne({ name: req.body.name }, function( err, poi) {
    // jsonData = JSON.parse(req.body);
    // console.log(jsonData);

    if ( poi ) {

        // this POI exists, can't create
        console.log(`>>> poi already exists (name: ${req.body.name}) <<<`)
        // res.sendStatus(201);
        // res.status = 201;
        res.json({
            poi,
            result: false
        });

    } else {

        // This POI doesn't exist...
        const createdDate = new Date();
        const newPoi = new poiModel({
            user_id: req.body.user_id,
            name: req.body.name,
            description: req.body.description,
            kind: req.body.kind,
            link: req.body.link,
            dd_coord:{
                "longitude": req.body.dd_coord.longitude,
                "latitude": req.body.dd_coord.latitude,
                "address": {
                    "full_text": req.body.dd_coord.address.full_text,
                    "country": req.body.dd_coord.address.country
                },
            }
        });

        // Create new POI
        newPoi.save(function( error, poi ) {
            if ( err === null ) {
            console.log("CREATE: OK");
            res.json({ poi, result:true });
            } else {
            console.log("CREATE: error", err);
            res.json({ err, result:false });
            }
        }); // end save

    } // end else
  }); // end findOne

// END ROUTE => CREATE-POI
});

/* GET=READ */
router.get('/read-by-id', function (req, res, next) {
    console.log("ROUTE: poi/read-by-id", req.query);
    poiModel.findById(req.query.poi_id, function (err, poi) {
        console.log("error:", err);
        if (poi !== null) {

            // POI found => return it
            res.json({
                poi,
                result: true
            });

        } else {

            // POI is not found => return false
            res.json({
                poi: null,
                result: false
            });

        }
    });
    // END ROUTE => READ-POI
});

/* GET=READ */
router.get('/read-by-userid', function (req, res, next) {
    console.log("ROUTE: poi/read-by-user-id", req.query);
    poiModel.find({
        user_id: req.query.user_id
        }, function (err, pois) {
        console.log("error:", err);
        if (pois !== null) {

            // 1,n POI found => return it (array)
            res.json({
                list: pois,
                count: pois.length,
                result: true
            });

        } else {

            // POI is not found => return false
            res.json({
                poi: null,
                result: false
            });

        }
    });
    // END ROUTE => READ-POI
});

/* GET=READ */
router.get('/list-id-by-userid', function (req, res, next) {
    console.log("ROUTE: poi/read-by-user-id", req.query);
    // TODO: check if the user_id is a valid objectId
    poiModel.find(
        { user_id: req.query.user_id }, 
        "_id", 
        function (err, pois) {
            console.log("error:", err);
            if (err === null) {

                // 0,n POI found => return it (array)
                res.json({
                    list: pois,
                    count: pois.length,
                    result: true
                });

            } else {

                // Error found => return false
                res.json({
                    err,
                    result: false
                });

            }
        });
    // END ROUTE => READ-POI
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({message: 'route /'});
});

module.exports = router;