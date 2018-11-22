// CONSTANTS
//const C_HOST_URL = "https://localhost:3000";
const C_REST_URL = "https://trace-rest.herokuapp.com";
const fetch = require("node-fetch");

// Initialisation
console.clear();

const main = async () => {
    
    // ============================= TEST REST API ===================================
    // Invoke REST API route
    let url = `${C_REST_URL}/poi/read-by-userid?user_id=5bf5a3b0963b050016445ef0`;
    let response = await fetch(url, {
        json: true,
        method: 'GET'
    })
    // **.then( (response) => {
    // **    return response.json();
    // ** })

    // Get back POI list of specified USER
    // ** console.log(response)
    const json = await response.json();
    // ** console.log(json);
    if (json.result) {
        pois = json.list
        console.log(`Get back ${json.count} items...`);
        for (let p=0; p<json.count;p++) {
            console.log("long. = " + pois[p].dd_coord.longitude);
            console.log("lat. = " + pois[p].dd_coord.latitude);
            console.log("");
        }

    } else {
        console.log(`An error occured on REST API...`, json);
        return;
    }
    // ============================= TEST REST API ===================================

}

// Call MAIN() function in synchronous mode
main()
    .then(
        (data) => {
            console.log("End main() =>", data)
        //console.log(">>>", user_id);
        }
    )