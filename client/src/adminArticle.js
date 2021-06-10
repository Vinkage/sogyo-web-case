import {
    AdminAttraction
} from "./templateImplementations.js"

import {
    kill,
    findParent
} from "./utils.js"

export function addAttractionInDatabase(newattraction) {

    return async function addAttraction(event) {
        const name = newattraction.querySelector("#newattractionname").value;
        const description = newattraction.querySelector("#newattractiondescription").value;
        const lat = Number.parseFloat(newattraction.querySelector("#newlat").value);
        const lon = Number.parseFloat(newattraction.querySelector("#newlong").value);
        if (!name || !description) return;
        if (Number.isNaN(lat)) return;
        if (Number.isNaN(lon)) return;

        console.log("adding " + name + " at lat: " + lat + " and long: " + lon);
        try {
            const response = await fetch("api/admin/add",
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({name: name, description: description, lat: lat, lon: lon}) // body data type must match "Content-Type" header
              });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

            const main = findParent(parent => {return parent.tagName === "MAIN"})(event.target)
            const template = main.parentNode.querySelector("#adminattraction");
            const attractionJSON = await response.json();
            console.log(attractionJSON)
            const newAttraction = new AdminAttraction(attractionJSON, template);
            newAttraction.addToNode(main);

        } catch(error) {
            console.log("Something went wrong when deleting an attraction: ", error);
        }

    }
}

export function deleteAttractionInDatabase(name) {
    return async function deleteAttraction(event) {
        console.log("deleting " + name);
        try {
            const response = await fetch("api/admin/delete",
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({name: name}) // body data type must match "Content-Type" header
              });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

        } catch(error) {
            console.log("Something went wrong when deleting an attraction: ", error);
        }
        kill(findParent(parent => {return parent.tagName === "ARTICLE"})(event.target));
    }
}


export function updateAttractionInDatabase(name, field) {
    return async function update(event) {
        console.log("updating " + field + " field of " + name);
        try {
            const response = await fetch("api/admin/edit",
                {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                      'Content-Type': 'application/json'
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify({name: name, field: field, value: event.target.value}) // body data type must match "Content-Type" header
              });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
            }

        } catch(error) {
            console.log("Something went wrong when editing an attraction: ", error);
        }
    }
}
