// CONSTANTS
//const C_HOST_URL = "https://localhost:3000";
const request = require("request");
const C_REST_URL = "https://trace-rest.herokuapp.com";

// const user_id = "5bf68444a699df00163f199";    // it's not an objectid
//const user_id = "5bf68444a699df00163f1997";
const user_id = "5bf68444a699df00163f1999";
const url = `${C_REST_URL}/poi/read-by-userid?user_id=${user_id}`;
console.log("Starts script...", url);

request.get(url, (error, response, body) => {

    // console.log("status", response.statusCode && response); // print statusCode
    // console.log("body", body); // print body
    
    if ( !error ) {
        
        let json = JSON.parse(body);
        
        // Check request result
        console.log(json.result)
        if ( json.result ) {
            
            // Explore POIs list 
            const pois = json.list;
            for (let p = 0; p < json.count; p++) {
                
                console.log(`name[${p}]      => ${pois[p].name}`);
                console.log(`longitude[${p}] => ${pois[p].dd_coord.longitude}`);
                console.log(`latitude[${p}]  => ${pois[p].dd_coord.latitude}`);
                console.log("");
                
            }
            
        } else {
            // REST responds result:false...
            console.log("result:", result)
        }

    } else {
        // error occuried...
        console.log("error: ", error);    // print error if occured
    }
        
});

console.log("Ends script...");


// END OF SCRIPT