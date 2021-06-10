import { ParkArticle } from "./templateImplementations.js";
import {
    displayNumberOfItemsInShoppingBasketWithBadge,
    dutchCurrencyFormat,
    dutchCurrencyFormatWithSign,
    findParent
} from "./utils.js";
import { fetchAttractions } from "./functions.js"


// ik struggle een beetje met de database connecten met de api...
//
// loop ineens tegen de volgende error aan:

function displayArticles(articles) {
    console.log("displaying attraction articles");
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
    return function receiver(payload) {
        console.log('checking if button should be disabled');
        const inputs = button.parentNode.querySelectorAll("input");
        var inputTickets = 0;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value > 0) {
                inputTickets = inputTickets + Number.parseInt(inputs[i].value);
            }
        }

        const shoppingBasketArray = JSON.parse(localStorage.getItem("shoppingBasketArray"));
        // console.log(shoppingBasketArray);
        var shoppingBasketTickets = 0;

        if (shoppingBasketArray) {
            for (let i = 0; i < shoppingBasketArray.length; i++) {
                if (shoppingBasketArray[i].name === name) {
                    shoppingBasketTickets = shoppingBasketTickets + shoppingBasketArray[i].numberOfKids + shoppingBasketArray[i].numberOfAdults;
                }
            }
        }
        const totalTickets = inputTickets + shoppingBasketTickets;

        function disablerHelper(payload) {
            var attraction;
            if (Array.isArray(payload)) {
                for (let i = 0; i < payload.length; i++) {
                    if (payload[i].name === name) {
                        attraction = payload[i];
                    }
                }
            } else attraction = payload;

            var front = button.querySelector(".front");
            if (attraction.available < totalTickets || attraction.available === 0 || attraction.available === shoppingBasketTickets) {
                console.log("---> disabling " + attraction.name + " button since the available tickets are " + attraction.available + " and tickets among current order is " + totalTickets);
                front.classList.add("disabled");
                button.removeEventListener("click", orderButtonClicked);
            } else {
                console.log("---> enabling " + attraction.name + " button since the available tickets are " + attraction.available + " and tickets among current order is " + totalTickets);
                front.classList.remove("disabled");
                button.addEventListener("click", orderButtonClicked);
            }

        }

        // console.log(payload)
        if (payload && payload.name) {
            if (payload.name) {
                // console.log("prevented unnecesary fetch")
                disablerHelper(payload);
            }
        } else {
            // console.log("unnecesary fetch")
            fetchAttractions()
                .then(disablerHelper)
                .catch(error => {console.error(error)});
        }
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

    console.log("---> found this info on the client side:")
    console.log(orderClientSideInfo);

    if ((orderClientSideInfo.numberOfKids > 0 && orderClientSideInfo.numberOfAdults >= 0) || (orderClientSideInfo.numberOfAdults > 0 && orderClientSideInfo.numberOfKids >= 0)) {
        fetchAttractions()
            .then(checkTicketAvailability(button, orderClientSideInfo))
            .then(saveOrderInShoppingBasket(orderClientSideInfo))
            .then(disableButton(orderClientSideInfo.name, button))
            .catch((error) => {console.error(error)})
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
    console.log("---> ---> saving info in shopping basket");

    return function serverAttractionsAccepter(serverAttractionsArray) {
        // const orderClientSideInfo = this;

        var price;
        var attraction;
        for (let i = 0; i < serverAttractionsArray.length; i++) {
            if (serverAttractionsArray[i].name === orderClientSideInfo.name) {
                 price = calulateTotal(
                    orderClientSideInfo.numberOfKids,
                    orderClientSideInfo.numberOfAdults,
                    serverAttractionsArray[i]
                 );
                attraction = serverAttractionsArray[i];
            }
        }

        orderClientSideInfo.price = price;
        console.log("---> ---> price is saved in the shopping basket order");
        console.log(orderClientSideInfo);

        var shoppingBasketArray;

        if (localStorage.getItem("shoppingBasketArray") === null) {
            shoppingBasketArray = [];
            shoppingBasketArray.push(orderClientSideInfo);
        } else {
            shoppingBasketArray = JSON.parse(localStorage.getItem("shoppingBasketArray"));
            shoppingBasketArray.push(orderClientSideInfo);
        }

        localStorage.setItem("shoppingBasketArray", JSON.stringify(shoppingBasketArray));
        console.log("---> ---> order is saved in array in localstorage");
        console.log(localStorage);
        displayNumberOfItemsInShoppingBasketWithBadge();
        return attraction;
    }
}

function calulateTotal(numberOfKids, numberOfAdults, serverSideAttraction) {
    console.log("---> calculating total of order in shoppingbasket!");
    console.log("---> ---> fetched this attraction to calculate actual prices!");
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
    console.log("displaying a total price based on client side info");
    var order = findParent(parent => {return parent.classList.contains("order")})(event.target)
    console.log(order)
    var total = order.querySelector(".total");

    var kids = order.querySelector(".numberofkids").value;
    var adults = order.querySelector(".numberofadults").value;
    if (kids === "") kids = 0;
    if (adults === "") adults = 0;

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
        console.log("---> applying the discount of " + discountPercentage + "%, resulting in " + discount + " discount")
    }
    // console.log(value);

    var priceString = dutchCurrencyFormat(value);
    if (!(discount === undefined)) {
        priceString = priceString + " discount: " + dutchCurrencyFormatWithSign(discount);
    }
    total.querySelector(".price").textContent = priceString;
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

fetchAttractions()
    .then(displayArticles);
