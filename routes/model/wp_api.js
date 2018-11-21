// var request = require('request');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// __ WP SCHEMA ________________________________________

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

const wpSchema = mongoose.Schema({
    poi_id: {
        type: ObjectId,
        require: true
    },
    step_id: {
        type: ObjectId,
        require: true
    },
    wp_sequence: Number,
    name: String,
    timing: String,
    type: String,
    kind: String,
    description: String,
    instruction: String,
    dd_coord: Coord_DD,
    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Date,
    // updated_date: Date,
    version: Number
});

const wpModel = mongoose.model("way_point", wpSchema);

// __ WP SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function (req, res, next) {
    console.log("ROUTE: wp/create", req.body);

    // Check if WP exist?
    wpModel.findOne({
        poi_id: req.body.poi_id,
        step_id: req.body.step_id,
        type: req.body.type
    }, function (err, wp) {
        if (wp) {

            // this WP exists, can't create
            console.log(`>>> wp already exists (name: ${req.body.name}) <<<`);
            console.log("wp: ", wp)
            res.json({
                "_id": wp._id,
                "result": false
            });

        } else {

            // This wp doesn't exist...
            const createdDate = new Date();
            const newWP = new wpModel({
                // wp_id: req.body.wp_id,
                poi_id: req.body.poi_id,
                step_id: req.body.step_id,
                wp_sequence: req.body.wp_sequence,
                name: req.body.name,
                timing: req.body.timing,
                type: req.body.type,
                kind: req.body.kind,
                description: req.body.description,
                instruction: req.body.instruction,
                dd_coord: req.body.dd_coord,
                // ATTENTION : Date au format "MM-DD-YYYY" !
                created_date: createdDate,
                version: 1
            });
            // Create new wp
            console.log(newWP)
            newWP.save(function (error, wp) {
                if (err === null) {
                    console.log("CREATE: OK", wp);
                    res.json({
                        wp,
                        "result": true
                    });
                } else {
                    console.log("CREATE: error", err);
                    res.json({
                        err,
                        "result": false
                    });
                }
            }); // end save
        } // end else
    }); // end findOne

    // END ROUTE => CREATE-WP
});

/* GET=READ */
router.get('/read', function (req, res, next) {
    console.log("ROUTE: wp/read", req.query);
    wpModel.findById(req.query.wp_id, function (err, wp) {
        console.log("error:", err);
        if (wp !== null) {

            // WP found => return it
            res.json({
                wp,
                result: true
            });

        } else {

            // WP is not found => return false
            res.json({
                wp: null,
                result: false
            });

        }
    });
    // END ROUTE => READ-WP
});

/* DELETE=WP */
router.delete('/delete', function (req, res, next) {
    console.log("ROUTE: wp/delete", req.query.wp_id);

    wpModel.findOne( { _id: req.query.wp_id }, function (error, wp) {
        console.log(wp);
        const msg = `Way Point ${req.query.wp_id} has been deleted...`;
        res.status(200).send(msg);
    });

    // END ROUTE => DELETE-WP
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        message: 'route /'
    });
});

module.exports = router;