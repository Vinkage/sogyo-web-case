import { ParkArticle } from "./templateImplementations.js";

import {
    fetchAttractions,
    displayNumberOfItemsInShoppingBasketWithBadge,
    dutchCurrencyFormat,
    dutchCurrencyFormatWithSign,
    findParent,
    killChildren,
} from "./utils.js";


// ik struggle een beetje met de database connecten met de api...
//
// loop ineens tegen de volgende error aan:

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

displayNumberOfItemsInShoppingBasketWithBadge();
setStickyNavBar();

const sortmenu = document.querySelector("#sortmenu");

console.log(sortmenu)

fetchAttractions()
    .then(displayArticles);
