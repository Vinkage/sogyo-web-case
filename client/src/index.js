import { ParkArticle } from "./templateImplementations.js";

import {
    fetchAttractions,
    displayNumberOfItemsInShoppingBasketWithBadge,
    dutchCurrencyFormat,
    dutchCurrencyFormatWithSign,
    findParent,
    killChildren,
    getUserGeoLocation,
    distanceToUser,
    bubbleSort,
} from "./utils.js";


// ik struggle een beetje met de database connecten met de api...
//
// loop ineens tegen de volgende error aan:

const userLocation = await getUserGeoLocation();

function displayArticles(articles) {
    console.log("displaying attraction articles");

    for (var i = 0; i < articles.length; i++) {
        var parkArticle = new ParkArticle(articles[i], document.querySelector("#parkarticle"));
        parkArticle.addToNode(document.querySelector("#center-articles"));
    }

}

function setStickyNavBar() {
    console.log("making the navbar sticky");
    // Get the header
    var header = document.getElementById("sticky-header");

    // Get the offset position of the navbar
    var sticky = header.offsetTop;

    // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function makeHeaderStickyWhenScrolling() {

        if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
        } else {
            header.classList.remove("sticky");
        }
    }
    // Sticky navigation bar stuff
    //
    // When the user scrolls the page, execute myFunction
    window.onscroll = function() {makeHeaderStickyWhenScrolling()};

}

function sortAttractionsBasedOn(sorter) {
    return async function whenButtonIsClicked(event) {
        console.log("sorting attractions")
        const main = findParent(parent => {return parent.tagName === "MAIN"})(event.target);
        const articlesParent = main.querySelector("#center-articles");

        const clickedButton = findParent(parent => {return parent.tagName === "BUTTON"})(event.target);
        const sortMenu = findParent(parent => {return parent.id === "sortmenu"})(clickedButton);
        const allSortButtons = sortMenu.querySelectorAll("button");

        console.log(allSortButtons)
        for (let i = 0; i < allSortButtons.length; i++) {
            if (!(allSortButtons[i].id === clickedButton.id)) allSortButtons[i].querySelector(".front").textContent = "sort";
        }


        const frontOfButton = clickedButton.querySelector(".front");
        const buttonText = frontOfButton.textContent.trim();
        console.log(buttonText.trim())

        var compare;
        if (buttonText === "ascending") {
            compare = (previousElementKey, elementKey) => {return previousElementKey < elementKey}
            frontOfButton.textContent = "descending";
        } else if (buttonText === "descending") {
            compare = (previousElementKey, elementKey) => {return previousElementKey > elementKey}
            frontOfButton.textContent = "ascending";
        } else {
            compare = (previousElementKey, elementKey) => {return previousElementKey > elementKey}
            frontOfButton.textContent = "ascending";
        }

        killChildren(child => {return child.tagName === "ARTICLE"})(articlesParent);

        fetchAttractions()
            .then(sorter(compare))
            .then(displayArticles)
    }
}

function priceSorter(compare) {

    const sortKey = attraction => {
                const adultPrice = attraction.adultPrice;
                const kidsPrice = attraction.kidsPrice;
                return ((adultPrice + kidsPrice) / 2);
            };

    return function sorted(attractions) {
        console.log("sorting on mean price: ")
        console.log(attractions)
        return bubbleSort(attractions,
            sortKey,
            compare
        )
    }
}

function locationSorter(compare) {

    const sortKey = attraction => {
                return distanceToUser(userLocation)(attraction.location.lat, attraction.location.lon);
            };


    return function sorted(attractions) {
        console.log("sorting on distance to user: ")
        console.log(attractions)
        return bubbleSort(attractions,
            sortKey,
            compare
        )
    }
}


displayNumberOfItemsInShoppingBasketWithBadge();
setStickyNavBar();

const sortmenu = document.querySelector("#sortmenu");
const priceSortButton = sortmenu.querySelector("#sortprice");
const locationSortButton = sortmenu.querySelector("#sortlocation");

console.log(priceSortButton)
priceSortButton.addEventListener("click", sortAttractionsBasedOn(priceSorter));
locationSortButton.addEventListener("click", sortAttractionsBasedOn(locationSorter));


console.log(sortmenu)

fetchAttractions()
    .then(displayArticles);
