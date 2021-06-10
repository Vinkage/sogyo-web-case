import { Order } from "./templateImplementations.js"
import {
    displayNumberOfItemsInShoppingBasketWithBadge,
    fetchOrders,
} from "./utils.js";


async function displayOrders() {
    displayNumberOfItemsInShoppingBasketWithBadge();
    console.log("displaying orders in database");

    var orders = await fetchOrders();
    if (orders === null || orders.length === 0) {
    }

    var main = document.querySelector("main");

    for (let i = 0; i < orders.length; i++) {
        var orderObj = new Order(orders[i], document.querySelector("#ticket"));
        orderObj.addToNode(main);
    }
}

displayOrders();
