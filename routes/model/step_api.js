// Declarations
const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();

// __ STEP SCHEMA ________________________________________
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
    Address: String
});

const stepSchema = mongoose.Schema({
    trip_id: {
        type: ObjectId,
        require: true
    },
    step_sequence: Number,
    status: String,
    title: {
        type: String,
        unique: true,
        require: true
    },
    description: String,
    step_date: Date,
    starting_time: String,
    means_of_transport: String,
    expected_distance: Number,
    real_distance: Number,
    expected_duration: String,
    from_dd_coord: Coord_DD,
    to_dd_coord: Coord_DD,
    way_point_count: Number,
    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Date,
    updated_date: Date,
    version: Number
})
const stepModel = mongoose.model("step", stepSchema);
// __ STEP SCHEMA ________________________________________

/*
==============
ROUTE API REST
==============
*/

/* POST=CREATE */
router.post('/create', function (req, res, next) {
    console.log("ROUTE: step/create", req.body);

    // Check if STEP exist?
    stepModel.findOne({
        title: req.body.title
        }, function (err, step) {
        if (step) {

            // this STEP exists, can't create
            console.log(`>>> step already exists (title: ${req.body.title}) <<<`)
            res.json({
                "_id": step._id,
                "result": false
            });

        } else {

            // This STEP doesn't exist...
            const createdDate = new Date();
            const newStep = new stepModel({

                "trip_id": req.body.trip_id,
                "step_sequence": req.body.step_sequence,
                "status": req.body.status,
                "title": req.body.title,
                "description": req.body.description,
                "step_date": req.body.step_date,
                "expected_distance": req.body.expected_distance,
                "real_distance": req.body.real_distance,
                "expected_duration": req.body.expected_duration,
                "means_of_transport": req.body.means_of_transport,
                "way_point_count": req.body.way_point_count,

                "from_dd_coord": {
                    "longitude": req.body.from_dd_coord.longitude,
                    "latitude": req.body.from_dd_coord.latitude
                },
                "to_dd_coord": {
                    "longitude": req.body.from_dd_coord.longitude,
                    "latitude": req.body.from_dd_coord.latitude
                },

                // ATTENTION : Date au format "MM-DD-YYYY" !
                "created_date": createdDate,
                "updated_date": null,
                "version": 1

            });

            // Create new STEP
            console.log(newStep)
            newStep.save(function (error, step) {
                console.log(step)
                if (err === null) {
                    console.log("CREATE: OK");
                    res.json({
                        step,
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

    // END ROUTE => CREATE-STEP
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({
        message: 'route /'
    });
});

module.exports = router;