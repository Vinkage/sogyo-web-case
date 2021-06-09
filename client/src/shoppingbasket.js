import { Order } from "./templateImplementations.js"
import { displayNumberOfItemsInShoppingBasketWithBadge, findParentWithTag, childKillerUsingTags } from "./utils.js";


function getOrderArray() {
    var orders = JSON.parse(localStorage.getItem("shoppingBasketArray"));
    return orders;
}

function displayOrders() {
    displayNumberOfItemsInShoppingBasketWithBadge();
    console.log("displaying orders in shopppingbasket");
    const orderFunctionality = {
        cancel: cancelOrder,
    };

    var orders = getOrderArray();
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
        orderObj.addToNode(main, orderFunctionality);
    }
}

function cancelOrder(event) {
    //console.log(event.target);
    console.log("cancel button clicked");
    const article = findParentWithTag.bind(event.target)("article");

    var previous = article.previousSibling;
    var i = 0;
    while (previous) {
        if (previous.tagName === "ARTICLE") {
            i = i+1;
        }
        previous = previous.previousSibling;
    }

    var orders = getOrderArray();
    console.log("---> canceling order ");
    console.log(orders[i]);
    console.log("---> removing it from shoppingbasket")
    orders.splice(i, 1);
    localStorage.setItem("shoppingBasketArray", JSON.stringify(orders));

    var main = document.querySelector("main");
    console.log("---> refreshing displayed orders")
    childKillerUsingTags(main)(main.firstChild)("article");
    displayOrders();
}




function finalizePayment(event) {
    console.log("finalizing payments");

    localStorage.clear();

    window.location.replace("orderplaced.html");
}


document.querySelector("#finalizepaymentbutton").addEventListener("click", finalizePayment);

displayOrders();
