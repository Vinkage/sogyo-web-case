import { Order } from "./templateImplementations.js"
import {
    displayNumberOfItemsInShoppingBasketWithBadge,
    readOrderArrayFromLocalStorage,
} from "./utils.js";


function displayOrders() {
    displayNumberOfItemsInShoppingBasketWithBadge();
    console.log("displaying orders in shopppingbasket");

    var orders = readOrderArrayFromLocalStorage();
    if (orders === null || orders.length === 0) {
        var button = document.querySelector("#finalizepaymentbutton");
        var front = button.querySelector(".front");

        front.classList.add("disabled");
        button.removeEventListener("click", finalizePayment);
        console.log(button);
        console.log(front);
        return;
    }

    var main = document.querySelector("main");

    for (let i = 0; i < orders.length; i++) {
        var orderObj = new Order(orders[i], document.querySelector("#ticket"));
        orderObj.addToNode(main);
    }
}

function finalizePayment(event) {
    console.log("finalizing payments");

    localStorage.clear();

    window.location.replace("orderplaced.html");
}
document.querySelector("#finalizepaymentbutton").addEventListener("click", finalizePayment);

displayOrders();
