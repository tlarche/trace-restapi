// CONSTANTS
//const C_HOST_URL = "https://localhost:3000";
const C_REST_URL = "https://trace-rest.herokuapp.com";
const fetch = require("node-fetch");

// Initialisation
console.clear();

const main = async () => {
    
    // ============================= TEST REST API ===================================
    // Invoke REST API route
    let url = `${C_REST_URL}/poi/read-by-userid?user_id=5bf68444a699df00163f1997`;
    let response = await fetch(url, {
        json: true,
        method: 'GET'
    })

    // Get back POI list of specified USER
    const json = await response.json();

    if (json.result) {

        console.log(`REST URL: ${url}`);
        console.log(`Get back ${json.count} items...`);
        
        // Explore POIs list 
        pois = json.list
        for (let p=0; p<json.count; p++) {

            console.log("name  = " + pois[p].name);
            console.log("long. = " + pois[p].dd_coord.longitude);
            console.log("lat.  = " + pois[p].dd_coord.latitude);
            console.log("");

        }
        
        // Return the list to promise
        return pois;

    } else {

        // result = false
        console.log(`An error occured on REST API...`, json);

        // Return the RESPONSE if 
        return response;

    }
    // ============================= TEST REST API ===================================

}

// Call MAIN() function in synchronous/promise mode
main()
    .then((data) => {
        console.log("End OK =>", data.length)

    })

    .catch((err) => {
        console.log("Unexpected Error :", err)
    })
        
// END OF SCRIPT