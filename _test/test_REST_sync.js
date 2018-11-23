// CONSTANTS
const fetch = require('node-fetch')
const C_REST_URL = 'https://localhost:3000'
// const C_REST_URL = 'https://trace-rest.herokuapp.com'

// Initialisation
console.clear()

const getPoiList = async (url) => {

    // ============================= TEST REST API ===================================
    // Invoke REST API route
    const response = await fetch(url, {
        json: true,
        method: 'GET'
    })

    // Get back POI list of specified USER
    const json = await response.json()

    if (json.result) {

        console.log(`REST URL: ${url}`)
        console.log(`Get back ${json.count} items...`)

        // Return the list (of POI) to promise
        return json.list

    } else {

        // result = false
        console.log(`An error occured on REST API...`, json)

        // Return the RESPONSE if 
        return response

    }
    // ============================= TEST REST API ===================================

}

// Call getPoiList() function in synchronous/promise mode
console.log('Starts script...')

// Build URL with the objectId
const userId = '5bf68444a699df00163f1997'
const url = `${C_REST_URL}/poi/read-by-userid?user_id=${userId}`
getPoiList(url)

    // if OK...
    .then((data) => {

        console.log('getPoiList (OK) =>', data.length);
        for (let p = 0; p < data.length; p++) {

            // Explore POIs list 
            console.log(`name[${p}]      => ${data[p].name}`);
            console.log(`longitude[${p}] => ${data[p].dd_coord.longitude}`);
            console.log(`latitude[${p}]  => ${data[p].dd_coord.latitude}`);
            console.log('');

        }

    })

    // if error...
    .catch((err) => {
        console.log('getPoiList (Unexpected Error) =>', err);
    })

console.log('ends script...')

// END OF SCRIPT
