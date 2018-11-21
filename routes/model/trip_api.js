// var request = require('request');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// __ TRIP SCHEMA ________________________________________
const ObjectId = mongoose.Schema.Types.ObjectId;
const tripSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        require: true
    },
    trip_sequence: Number,
    status: String,
    title: {type: String, unique: true},
    description: String,
    expected_distance: Number,
    start_date: Date,
    end_date: Date,
    main_means_of_transport: String,
    visited_country_list: [String] ,
    step_count: Number,
    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Date,
    updated_date: Date,
    version: Number
})
const tripModel = mongoose.model("trip", tripSchema);
// __ TRIP SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function (req, res, next) {
    console.log("ROUTE: trip/create", req.body);

    // Check if TRIP exist?
    tripModel.findOne({ title: req.body.title }, function (err, trip) {
        if ( trip ) {

            // this TRIP exists, can't create
            console.log(`>>> trip already exists (title: ${req.body.title}) <<<`)
            res.json({
                "_id": trip._id,
                "result": false
            });

        } else {

            // This trip doesn't exist...
            const createdDate = new Date();
            const newTrip = new tripModel({
                user_id: req.body.user_id,
                trip_sequence: req.body.trip_sequence,
                status: req.body.status,
                title: req.body.title,
                description: req.body.description,
                expected_distance: req.body.expected_distance,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                main_means_of_transport: req.body.main_means_of_transport,
                visited_country_list: [],
                step_count: req.body.step_count,
                // ATTENTION : Date au format "MM-DD-YYYY" !
                created_date: createdDate,
                updated_date: null,
                version: req.body.version
            });

            // Create new trip
            newTrip.save(function (error, trip) {
                if (err === null) {
                    console.log("CREATE: OK");
                    res.json({
                        trip,
                        result: true
                    });
                } else {
                    console.log("CREATE: error", err);
                    res.json({
                        err,
                        result: false
                    });
                }
            }); // end save
        } // end else
    }); // end findOne

    // END ROUTE => CREATE-TRIP
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        message: 'route /'
    });
});

module.exports = router;