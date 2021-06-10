import { AdminAttraction } from "./templateImplementations.js"

import {
    fetchAttractions,
} from "./utils.js"

import {
    addAttractionInDatabase
} from "./adminArticle.js"

function displayAdminAttractions(attractions) {
    console.log(attractions);
    const main = document.querySelector("main");
    const template = document.querySelector("#adminattraction");

    for (let i = 0; i < attractions.length; i++) {
        const attraction = attractions[i];
        const adminAttraction = new AdminAttraction(attraction, template);
        adminAttraction.addToNode(main);
    }
}

const newattraction = document.querySelector(".newattraction");
addbutton.addEventListener("click", addAttractionInDatabase(newattraction));

console.log("displaying AdminAttractions")
fetchAttractions()
    .then(displayAdminAttractions)
