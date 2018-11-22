// CONSTANTS
//const C_HOST_URL = "https://localhost:3000";
const C_HOST_URL = "https://trace-rest.herokuapp.com";
const C_FILE_NAME = "trip_v0.1.json";

// Define JSON File
const fs = require("fs");

const fetch = require("node-fetch");
const Joi = require("joi-browser");
const request = require("request");

console.clear();

// Validation for USER
const joi_schema_user = Joi.object().keys({

    user_uid: Joi.number().integer().min(1),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string(),
    country: Joi.string(),
    language: Joi.string().valid("fr", "ru").required(),
    user_status: Joi.string().valid("active", "blocked").required(),
    trip_count: Joi.number(),
    trip_list: Joi.array().items(Joi.object().required()),

    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Joi.date().required(),
    updated_date: Joi.date(),
    version: Joi.number()
    })

// Validation for TRIP
const joi_schema_trip = Joi.object().keys({

    user_id: Joi.string(),
    trip_id: Joi.number().integer().min(1),
    trip_sequence: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('planned', 'pending', 'achieved').required(),
    title: Joi.string().max(100),
    description: Joi.string().max(500),
    expected_distance: Joi.number().integer().min(1),
    real_distance: Joi.number().integer().min(1),
    start_date:Joi.date(),
    end_date: Joi.date(),
    main_means_of_transport: Joi.string().max(15),
    visited_country_list: Joi.array().items(Joi.string()),
    step_count: Joi.number().integer().required(),
    step_list: Joi.array().items(Joi.object().required()),

    // ATTENTION : Date au format "MM-DD-YYYY" !
    created_date: Joi.date().required(),
    updated_date: Joi.date(),
    version: Joi.number()    
    })

// Validation for STEP
const joi_schema_step = Joi.object().keys({

    trip_id: Joi.required(),
    step_sequence: Joi.number().integer().min(1).required(),
    step_date: Joi.date().required(),
    starting_time: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    expected_duration: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    expected_arrival_time: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    status: Joi.string().valid('planned', 'pending', 'achieved'),
    title: Joi.string().max(100),
    description: Joi.string().max(500),
    instruction: Joi.string().max(5000),
    expected_distance: Joi.number().integer().min(1),
    real_distance: Joi.number().integer().min(1),
    // $$$ => Rename from_dd_coord into coord_dd_from
    // $$$ => Rename to_dd_coord into coord_dd_to
    // $$$ => add coord_dms_from (dms=degree minute second)
    // $$$ => add coord_dms_to
    from_dd_coord: Joi.object(),
    to_dd_coord: Joi.object(),
    means_of_transport: Joi.string().max(15),
    way_point_count: Joi.number().integer().min(2).required(),
    way_point_list: Joi.array().items(Joi.object().required()),
    version: Joi.number()

    // // ATTENTION : Date au format "MM-DD-YYYY" !
    // created_date: Joi.date().required(),
    // updated_date: Joi.date(),
    // version: Joi.number()
})

// Validation for geographic COORDINATE
const joi_schema_coord = Joi.object().keys({
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    address: Joi.string().max(500)
})

// Validation for geographic WAY POINT / POI
const joi_schema_way_point_poi = Joi.object().keys({

    wp_sequence: Joi.number().integer().min(1).required(),
    name: Joi.string().max(100),
    timing: Joi.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
    type: Joi.string().valid("B", "E", "I", "S", "V"),
    kind: Joi.string().valid("way_point", "tourism", "historical", "hotel", "restaurant", "gas station", "train station", "hostipal", "home"),
    description: Joi.string().max(500),
    instruction: Joi.string().max(500),
    dd_coord: Joi.object()

    // ATTENTION : Date au format "MM-DD-YYYY" !
    // created_date: Joi.date().required(),
    // updated_date: Joi.date(),
    // version: Joi.number()
})

const main = async () => {

    try {
        console.log("\n *STARTING* \n");

        // Get content from file
        const rawData = fs.readFileSync(C_FILE_NAME);

        // Define to JSON type
        const obj = JSON.parse(rawData);

        // Get Value from JSON
        //console.log(obj);
        let result = Joi.validate(obj, joi_schema_user);
        if (result.error !== null) {
            console.log("Joi error (USER) =>", result.error);
            return;
        }

          ////////////////////////////////////////////////////////////////////////////
         // ==== REMOVE ALL COLLECTION (RESET DB) ===================================
        ///////////////////////////////////////////////////////////////////////////
        
        // Invoke REST API route
        let url = `${C_HOST_URL}/db/remove-all-collections`;
        let response = await fetch(url, {
            json: true,
            method: 'GET',
            // this line is important, if this content-type is not set it wont work
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(newUser)
        });

        // Get back user_id of user just created
        const status = await response.status;
        console.log(">>>" + status);
        if ( status === 200 ) {
            console.log(`All database's collections has been removed succesfully...`);
        } else {
            console.log(`An error occured on removing all collections...`, json);
            return;
        }
        // ==== REMOVE ALL COLLECTION (RESET DB) ===================================


        console.log("\n *TRAVERSING OBJ USER* \n");
        for (const myKey in obj) {
            //console.log(`key: "${myKey}", value: "${obj[myKey]}", typeof: "${typeof(obj[myKey])}"`);
        }
        
        // ==== USER ADD ===========================================================
        let user_id = "";
        const newUser = {
            "last_name": obj.last_name,
            "first_name": obj.first_name,
            "email": obj.email,
            "user_status": obj.user_status,
            "country": obj.country,
            "language": obj.language,
            "trip_count": obj.trip_count,
            "created_date": obj.created_date,
            "updated_date": obj.updated_date
        }
        result = Joi.validate(newUser, joi_schema_user);
        if (result.error !== null) {
            console.log("Joi error (NEW USER) =>", result.error);
            return;
        }
        
        // Create USER instance in db
        // Invoke REST API route
        url = `${C_HOST_URL}/user/create`;
        response = await fetch(url, {
            json: true,
            method: 'POST',
            // this line is important, if this content-type is not set it wont work
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        // Get back user_id of user just created
        json = await response.json();
        if (json.result) {
            user_id = json.user._id
            console.log(`user_id (${user_id}) has been created...`, json);  
        } else {
            console.log(`An error occured on USER creation...`, json);
            return;
        }
        // ==== USER ADD ===========================================================

        console.log("\n *TRAVERSING OBJ USER/TRIPS* \n");
        const trips = obj.trip_list;
        const trip_count = trips.length;
        console.log("# trips:", trip_count);

        for (let t=0; t<trip_count; t++) {

            //console.log(trips[t]);
            result = Joi.validate(trips[t], joi_schema_trip);
            if (result.error !== null) {
                console.log("Joi error (TRIP) =>", result.error);
                return;
            }

            // ==== TRIP ADD ===========================================================
            let trip_id = "";
            const newTrip = {
                "user_id": user_id,
                "trip_sequence": trips[t].trip_sequence,
                "status": trips[t].status,
                "title": trips[t].title,
                "description": trips[t].description,
                "expected_distance": trips[t].expected_distance,
                "real_distance": trips[t].real_distance,
                "start_date": trips[t].start_date,
                "end_date": trips[t].end_date,
                "main_means_of_transport": trips[t].main_means_of_transport,
                "visited_country_list": [],
                "step_count": trips[t].step_count,
                "created_date": trips[t].created_date
                // "updated_date": ""
            }
            result = Joi.validate(newTrip, joi_schema_trip);
            if (result.error !== null) {
                console.log("Joi error (NEW TRIP) =>", result.error);
                return;
            }
            
            // Create TRIP instance in db
            // Invoke REST API route
            const url = `${C_HOST_URL}/trip/create`;
            const response = await fetch(url, {
                json: true,
                method: 'POST',
                // this line is important, if this content-type is not set it wont work
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrip)
            });

            // Get back user_id of user just created
            const json = await response.json();
            if (json.result) {
                trip_id = json.trip._id
                console.log(`trip_id (${trip_id}) has been created...`, json);
            } else {
                console.log(`An error occured on TRIP creation...`, json);
                return;
            }
            // ==== TRIP ADD ===========================================================

            console.log(`\n *TRAVERSING OBJ USER/TRIP[${t}]/STEPS* \n`);
            const steps = trips[t].step_list;
            const step_count = steps.length;
            console.log("# steps:", step_count);
            
            for (let s = 0; s < step_count; s++) {
                console.log("Step#: ", s);
                
                // Validate data from input JSON file
                //console.log(steps[s]);
                // let result = Joi.validate(steps[s], joi_schema_step);
                // console.log("Joi error (STEP) =>", result.error);
                // if (result.error !== null) {
                //     return;
                // }

                // ==== STEP ADD ===========================================================
                let step_id = "";
                const newStep = {
                   "trip_id": trip_id,
                   "step_sequence": steps[s].step_sequence,
                   "status": steps[s].status,
                   "title": steps[s].title,
                   "description": steps[s].description,
                   "step_date": steps[s].step_date,
                   "expected_distance": steps[s].expected_distance,
                   "real_distance": steps[s].real_distance,
                   "expected_duration": steps[s].expected_duration,
                   "means_of_transport": steps[s].means_of_transport,
                   "way_point_count": steps[s].way_point_count,
                   "from_dd_coord": {
                       "longitude": steps[s].from_dd_coord.longitude,
                       "latitude": steps[s].from_dd_coord.latitude
                   },
                   "to_dd_coord": {
                       "longitude": steps[s].from_dd_coord.longitude,
                       "latitude": steps[s].from_dd_coord.latitude
                   },
                   // ATTENTION : Date au format "MM-DD-YYYY" !
                   //"created_date": createdDate,
                   // updated_date: null,
                   "version": 1 // "updated_date": ""
                }
                // console.log(newStep);
                result = Joi.validate(newStep, joi_schema_step);
                if (result.error !== null) {
                    console.log("Joi error (NEW step) =>", result.error);
                    return;
                }

                // Create STEP instance in db
                // Invoke REST API route
                const url = `${C_HOST_URL}/step/create`;
                const response = await fetch(url, {
                    json: true,
                    method: 'POST',
                    // this line is important, if this content-type is not set it wont work
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newStep)
                });

                // Get back step_id of STEP just created
                const json = await response.json();
                if (json.result) {
                    step_id = json.step._id
                    console.log(`step_id (${step_id}) has been created...`, json);
                } else {
                    console.log(`An error occured on STEP creation...`, json);
                    return;
                }
                // ==== STEP ADD ===========================================================


                for (const myKey in steps[s]) {
                        //console.log(`key: "${myKey}", value: "${steps[s][myKey]}", typeof: "${typeof(steps[s][myKey])}"`);
                }
                // console.log(`key: "from_dd_coord.longitude", value: "${steps[s].from_dd_coord.longitude}"`);
                // console.log(`key: "from_dd_coord.latitude", value: "${steps[s].from_dd_coord.latitude}"`);
                // console.log(`key: "to_dd_coord.longitude", value: "${steps[s].to_dd_coord.longitude}"`);
                // console.log(`key: "to_dd_coord.latitude", value: "${steps[s].to_dd_coord.latitude}"`);
                result = Joi.validate(steps[s].from_dd_coord, joi_schema_coord);
                if (result.error !== null) {
                    console.log("Joi error (STEP/COORD) =>", result.error);
                    return;
                }
                result = Joi.validate(steps[s].to_dd_coord, joi_schema_coord);
                if (result.error !== null) {
                    console.log("Joi error (STEP/COORD) =>", result.error);
                    return;
                }

                console.log(`\n *TRAVERSING OBJ USER/TRIP[${t}]/STEP[${s}]/WAY_POINTS* \n`);
                const way_points = steps[s].way_point_list;
                const way_point_count = way_points.length;
                console.log("# WayPoints:", way_point_count);

                for(let wp = 0; wp < way_point_count; wp++) {

                    console.log("WayPoint#: ", wp);

                    result = Joi.validate(way_points[wp], joi_schema_way_point_poi); 
                    if (result.error !== null) {
                        console.log("Joi error (STEP/WP) =>", result.error);
                        return;
                    }

                    // ==== POI ADD ===========================================================
                    const newPoi = {
                        "user_id": user_id,
                        "name": way_points[wp].name,
                        "description": way_points[wp].description,
                        "kind": way_points[wp].kind,
                        "link": way_points[wp].link,
                        "dd_coord": {
                            "longitude": way_points[wp].dd_coord.longitude,
                            "latitude": way_points[wp].dd_coord.latitude,
                            "address": {
                                "full_text": way_points[wp].dd_coord.address,
                                "country": ""
                            },
                        }
                    }

                    // Create POI instance in db
                    // Invoke REST API route
                    let url = `${C_HOST_URL}/poi/create`;
                    let response = await fetch(url, {
                        json: true,
                        method: 'POST',
                        // this line is important, if this content-type is not set it wont work
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newPoi)
                    });

                    // Get back poi_id of POI just created
                    let json = await response.json();
                    let status = await response.status;
                    // console.log(">>>>>>>>>>>>>>>>", json, status)

                    poi_id = json.poi._id
                    if ( json.result ) {
                        console.log(`poi_id (${poi_id}) has been created...`, json);
                    } else {
                        console.log(`An error occured on POI creation...`, json);
                        //return;
                    } 
                    // ==== POI ADD ===========================================================
                    
                    // ==== WP ADD ============================================================
                    const newWP = {
                        poi_id: poi_id,
                        step_id: step_id,
                        wp_sequence: way_points[wp].wp_sequence,
                        name: way_points[wp].name,
                        description: way_points[wp].description,
                        instruction: way_points[wp].instruction,
                        type: way_points[wp].type,
                        kind: way_points[wp].kind,
                        link: way_points[wp].link,
                        dd_coord: {
                            "longitude": way_points[wp].dd_coord.longitude,
                            "latitude": way_points[wp].dd_coord.latitude,
                            "address": {
                                "full_text": way_points[wp].dd_coord.address,
                                "country": ""
                            },
                        }
                    }
                    console.log(newWP);
                    // result = Joi.validate(newPoi, joi_schema_poi);
                    // if (result.error !== null) {
                    //     console.log("Joi error (NEW POI) =>", result.error);
                    //     return;
                    // }

                    // Create WP instance in db
                    // Invoke REST API route
                    url = `${C_HOST_URL}/wp/create`;
                    response = await fetch(url, {
                        json: true,
                        method: 'POST',
                        // this line is important, if this content-type is not set it wont work
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newWP)
                    });

                    // Get back wp_id of WAY_POINT just created
                    json = await response.json();
                    status = await response.status;
                    // console.log(">>>>>>>>>>>>>>>>", json, status)

                    wp_id = json.wp._id
                    if ( json.result ) {
                        console.log(`wp_id (${wp_id}) has been created...`, json);
                    } else {
                        console.log(`An error occured on WP creation...`, json);
                        //return;
                    } 
                    // ==== WP ADD (END)=======================================================

                    // for (const myKey in way_points[wp]) {
                    //     console.log(`key: "${myKey}", value: "${way_points[wp][myKey]}", typeof: "${typeof(way_points[wp][myKey])}"`);
                    // }
                    // console.log(`key: "dd_coord.longitude", value: "${way_points[wp].dd_coord.longitude}"`);
                    // console.log(`key: "dd_coord.latitude", value: "${way_points[wp].dd_coord.latitude}"`);
                    // result = Joi.validate(way_points[wp].dd_coord, joi_schema_coord);
                    // if (result.error !== null) {
                    //     console.log("Joi error (WP/COORD) =>", result.error);
                    //     return;
                    // }
                    // result = Joi.validate(way_points[wp].dd_coord, joi_schema_coord);
                    // if (result.error !== null) {
                    //     console.log("Joi error (WP/COORD) =>", result.error);
                    //     return;
                    // }
                    console.log("\n");  // end POI / WP

                }   // end wp
                console.log("\n");

            }   // step
            console.log("\n");

        }   // trip

        // end file / user




        console.log("\n *WRITE JSON FILE* \n");
        const content = JSON.parse(JSON.stringify(obj.trip_list[0].step_list));
        // ** let content = JSON.stringify(obj.trip_list[0].step_list);
        // ** content = JSON.parse(content);
        // ** const content = obj.trip_list[0].step_list;

        // Save the JSON file in ASYNC mode
        fs.writeFile('trip_v0.1 [write].json', content, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });

        console.log("\n *EXIT* \n");

        // ** return json._id

    } catch (error) {
        console.log(error);
    }
};

main()
    .then(
        (data) => console.log("Fin main() =>", data)  
        //console.log(">>>", user_id);
    )