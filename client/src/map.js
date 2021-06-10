import { fetchAttractions } from "./functions.js"
import { ParkArticle } from "./templateImplementations.js"

// replace "toner" here with "terrain" or "watercolor"
var layer = new L.StamenTileLayer("watercolor");
var map = new L.Map("discoverablemap", {
    center: new L.LatLng(52.1026406, 5.175044799999999),
    zoom: 10
});
map.addLayer(layer);

function addMarkersForAttractions(map) {
    return function addMarkers(attractions) {
        for (let i = 0; i < attractions.length; i++) {
            const attraction = attractions[i];
            const location = attraction.location;

            const marker = L.marker([location.lat, location.lon]).addTo(map);

            const articleObj = new ParkArticle(attraction, document.querySelector("parkpopup"))
            console.log(articleObj)
            const parkArticleFunctionality = {
                orderButtonClick: orderButtonClicked,
                displayTotal: displayTotal,
                disableButton: disableButton,
            }
            const articleHTML = articleObj.toHTML(parkArticleFunctionality);
            console.log(articleHTML);


            marker.bindPopup(
                articleHTML
            )

        }
    }
}


 fetchAttractions()
        .then(addMarkersForAttractions(map));
