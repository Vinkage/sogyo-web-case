import { Order } from "./templateImplementations.js"
import { displayNumberOfItemsInShoppingBasketWithBadge, findParentWithTag, childKillerUsingTags } from "./utils.js";


function getOrderArray() {
    var orders = JSON.parse(localStorage.getItem("shoppingBasketArray"));
    return orders;
}

function displayOrders() {
    displayNumberOfItemsInShoppingBasketWithBadge();
    const orderFunctionality = {
        cancel: cancelOrder,
    };

    var orders = getOrderArray();
    if (orders === null) return;

    var main = document.querySelector("main");

    for (let i = 0; i < orders.length; i++) {
        var orderObj = new Order(orders[i], document.querySelector("#ticket"));
        orderObj.addToNode(main, orderFunctionality);
    }
}

function cancelOrder(event) {
    //console.log(event.target);
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
    orders.splice(i, 1);
    localStorage.setItem("shoppingBasketArray", JSON.stringify(orders));

    var main = document.querySelector("main");
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
