// Declarations
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/* 
==================
GET home page. 
==================
*/
router.get('/remove-all-collections', function (req, res, next) {
try {

    // Trace the route
    console.log("ROUTE: db/remove-all-collections", req.query);

    // Remove WAY_POINTS collection
    mongoose.connection.db.dropCollection("way_points", function (err, result) {
    console.log(result)
    if (err) {
        console.log("error deleting collection [way_points]");
    } else {
        console.log("deleting collection [way_points] success");
    }
    });

    // Remove POIs collection
    mongoose.connection.db.dropCollection("pois", function (err, result) {
    console.log(result)
    if (err) {
        console.log("error deleting collection [pois]");
    } else {
        console.log("deleting collection [pois] success");
    }
    });

    // Remove STEPs collection
    mongoose.connection.db.dropCollection("steps", function (err, result) {
    console.log(result)
    if (err) {
        console.log("error deleting collection [steps]");
    } else {
        console.log("deleting collection [steps] success");
    }
    });

    // Remove TRIPs collection
    mongoose.connection.db.dropCollection("trips", function (err, result) {
    console.log(result)
    if (err) {
        console.log("error deleting collection [trips]");
    } else {
        console.log("deleting collection [trips] success");
    }
    });

    // Remove USERs collection
    mongoose.connection.db.dropCollection("users", function (err, result) {
    console.log(result)
    if (err) {
        console.log("error deleting collection [users]");
    } else {
        console.log("deleting collection [users] success");
    }
    });
    res.status(200).send("Unexpected error found...").status(500);
}

catch(e) {
    console.log(e);
    res.status(500).send("Unexpected error found...");
}
    
});

module.exports = router;