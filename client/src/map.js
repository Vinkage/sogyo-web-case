import { fetchAttractions } from "./utils.js"
import { ParkArticle } from "./templateImplementations.js"

// replace "toner" here with "terrain" or "watercolor"
var layer = new L.StamenTileLayer("watercolor");
var map = new L.Map("discoverablemap", {
    center: new L.LatLng(52.1026406, 5.175044799999999),
    zoom: 10
});
map.addLayer(layer);

function addMarkersForAttractions(map) {
    const template = document.querySelector("#parkpopup");

    return function addMarkers(attractions) {
        for (let i = 0; i < attractions.length; i++) {
            const attraction = attractions[i];
            const location = attraction.location;

            const marker = L.marker([location.lat, location.lon]).addTo(map);

            const articleObj = new ParkArticle(attraction, template);
            const articleHTML = articleObj.toHTML();

            var div = L.DomUtil.create('div', 'popupcontent');
            const popupcontent = articleHTML;
            div.appendChild(popupcontent);

            marker.bindPopup(div)

        }
    }
}


 fetchAttractions()
        .then(addMarkersForAttractions(map));
