import { ParkArticle } from "./templateImplementations.js";
import { displayNumberOfItemsInShoppingBasketWithBadge, dutchCurrencyFormat, dutchCurrencyFormatWithSign } from "./utils.js";
import { fetchAttractions } from "./functions.js"



function displayArticles(articles) {

    const parkArticleFunctionality = {
        orderButtonClick: orderButtonClicked,
        displayTotal: displayTotal,
        disableButton: disableButton,
    }

    for (var i = 0; i < articles.length; i++) {
        var parkArticle = new ParkArticle(articles[i], document.querySelector("#parkarticle"));
        parkArticle.addToNode(document.querySelector("#center-articles"), parkArticleFunctionality);
    }

}

function disableButton(name, button) {
    return function inputEventReceiver(event) {
        const inputs = button.parentNode.querySelectorAll("input");
        var inputTickets = 0;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value > 0) {
                inputTickets = inputTickets + Number.parseInt(inputs[i].value);
            }
        }

        const shoppingBasketArray = JSON.parse(localStorage.getItem("shoppingBasketArray"));
        var shoppingBasketTickets = 0;

        if (shoppingBasketArray) {
            for (let i = 0; i < shoppingBasketArray.length; i++) {
                if (shoppingBasketArray[i].name === name) {
                    shoppingBasketTickets = inputTickets + shoppingBasketArray[i].numberOfKids + shoppingBasketArray[i].numberOfAdults;
                }
            }
        }
        const totalTickets = inputTickets + shoppingBasketTickets;
        fetchAttractions()
            .then(attractions => {

                var attraction;
                for (let i = 0; i < attractions.length; i++) {
                    if (attractions[i].name === name) {
                        attraction = attractions[i];
                    }
                }

                var front = button.querySelector(".front");
                if (attraction.available < totalTickets || attraction.available === 0 || attraction.available === shoppingBasketTickets) {
                    front.classList.add("disabled");
                    button.removeEventListener("click", orderButtonClicked);
                } else {
                    front.classList.remove("disabled");
                    button.addEventListener("click", orderButtonClicked);
                }

            })
            .catch(error => {console.error(error)});
    }
}

function orderButtonClicked(event) {

    console.log("button click");
    var button;

    if (event.target.classList.contains("orderbutton")) {
        button = event.target;
    } else {
        button = event.target.parentNode;
    }

    const order = button.parentNode;
    const parkArticle = order.parentNode;

    const orderClientSideInfo = {
        name: parkArticle.querySelector(".parkname").textContent,
        numberOfKids: Number(order.querySelector(".numberofkids").value),
        numberOfAdults: Number(order.querySelector(".numberofadults").value),
    }

    console.log(orderClientSideInfo);

    if ((orderClientSideInfo.numberOfKids > 0 && orderClientSideInfo.numberOfAdults >= 0) || (orderClientSideInfo.numberOfAdults > 0 && orderClientSideInfo.numberOfKids >= 0)) {
        fetchAttractions()
            .then(checkTicketAvailability(button, orderClientSideInfo))
            .then(saveOrderInShoppingBasket(orderClientSideInfo))
            .then(disableButton(orderClientSideInfo.name, button))
            .catch((error) => {console.log(error.message)})
    }
}

class TicketsNotAvailableError extends Error {
    constructor(message) {
        super(message);
        this.name = "TicketsNotAvailableError";
    }
}


export function checkTicketAvailability(button, orderClientSideInfo) {

    return function serverAttractionsAccepter(serverAttractionsArray) {
        var attraction;
        for (let i = 0; i < serverAttractionsArray.length; i++) {
            if (serverAttractionsArray[i].name === orderClientSideInfo.name) {
                attraction = serverAttractionsArray[i]
            }
        }

        if (attraction.available < orderClientSideInfo.numberOfKids + orderClientSideInfo.numberOfAdults) {
            throw new TicketsNotAvailableError("The tickets of the order exceed the available tickets!");
        }

        return serverAttractionsArray;
    }
}

function saveOrderInShoppingBasket(orderClientSideInfo) {
    console.log("saving in shopping basket");

    return function serverAttractionsAccepter(serverAttractionsArray) {
        // const orderClientSideInfo = this;

        var price;
        for (let i = 0; i < serverAttractionsArray.length; i++) {
            if (serverAttractionsArray[i].name === orderClientSideInfo.name) {
                 price = calulateTotal(
                    orderClientSideInfo.numberOfKids,
                    orderClientSideInfo.numberOfAdults,
                    serverAttractionsArray[i]
                 );
            }
        }

        console.log("totalprice: " + price.total);
        console.log("discount: " + price.discount);
        orderClientSideInfo.price = price;

        var shoppingBasketArray;

        if (localStorage.getItem("shoppingBasketArray") === null) {
            shoppingBasketArray = [];
            shoppingBasketArray.push(orderClientSideInfo);
        } else {
            shoppingBasketArray = JSON.parse(localStorage.getItem("shoppingBasketArray"));
            console.log("before adding to array: " + shoppingBasketArray);
            shoppingBasketArray.push(orderClientSideInfo);
            console.log("after adding to array: " + shoppingBasketArray);
        }

        localStorage.setItem("shoppingBasketArray", JSON.stringify(shoppingBasketArray));
        displayNumberOfItemsInShoppingBasketWithBadge();
    }
}

function calulateTotal(numberOfKids, numberOfAdults, serverSideAttraction) {
    console.log("Calculating total !");
    console.log(serverSideAttraction);

    const adultPrice = serverSideAttraction.adultPrice;
    const kidsPrice = serverSideAttraction.kidsPrice;

    const discountPercentage = serverSideAttraction.discount;
    const minNumberkids = serverSideAttraction.minimumNumberOfKids;
    const minNumberAdults = serverSideAttraction.minimumNumberOfAdults;

    var totalPrice = 0;
    if (numberOfKids > 0) {
        totalPrice = totalPrice +  numberOfKids * kidsPrice;
    }
    if (numberOfAdults > 0) {
        totalPrice = totalPrice + numberOfAdults * adultPrice;
    }

    if (numberOfKids >= minNumberkids && numberOfAdults >= minNumberAdults) {
        var discount = totalPrice * discountPercentage / 100;
        totalPrice = totalPrice - discount;
    }

    if (discount) {
        return {total:totalPrice, discount: discount}
    } else {
        return {total: totalPrice};
    }
}

function displayTotal(event) {
    var order = event.target.parentNode;
    var total = order.querySelector(".total");

    var kids = order.querySelector(".numberofkids").value;
    var adults = order.querySelector(".numberofadults").value;

    let re = /\d+/;
    var kidsPrice = order.querySelector(".kidsprice")
        .textContent
        .match(re)[0];
    var adultPrice = order.querySelector(".adultprice")
        .textContent
        .match(re)[0];

    var discountReq = order.querySelector(".discountrequirement")
    var minNumberkids = discountReq.querySelector(".child")
        .textContent
        .match(re)[0]
    var minNumberadults = discountReq.querySelector(".adults")
        .textContent
        .match(re)[0]
    var discountPercentage = discountReq.querySelector(".percentage")
        .textContent
        .match(re)[0];
    // console.log(discountPercentage);

    var value = 0;
    if (kids > 0) {
        value = value + Number.parseInt(kids) * Number.parseFloat(kidsPrice);
    }
    if (adults > 0) {
        value = value + Number.parseInt(adults) * Number.parseFloat(adultPrice);
    }

    var discount;
    if (Number.parseInt(kids) >= Number.parseInt(minNumberkids) && Number.parseInt(adults) >= Number.parseInt(minNumberadults)) {
        discount = value * Number.parseFloat(discountPercentage) / 100
        value = value - discount;
    }
    // console.log(value);

    var priceString = dutchCurrencyFormat(value);
    if (!(discount === undefined)) {
        priceString = priceString + " discount: " + dutchCurrencyFormatWithSign(discount);
    }
    total.querySelector(".price").textContent = priceString;
}


function setStickyNavBar() {
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

fetchAttractions()
    .then(displayArticles);
