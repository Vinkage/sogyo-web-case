import {
    fetchOrders,
    readOrderArrayFromLocalStorage,
    kill,
    findParent,
    displayNumberOfItemsInShoppingBasketWithBadge
} from "./utils.js"

export function cancelOrder(event) {
    //console.log(event.target);
    console.log("cancel button clicked");
    const article = findParent(parent => {return parent.tagName === "ARTICLE"})(event.target);

    var previous = article.previousSibling;
    var i = 0;
    while (previous) {
        if (previous.tagName === "ARTICLE") {
            i = i+1;
        }
        previous = previous.previousSibling;
    }

    var orders = readOrderArrayFromLocalStorage();
    console.log("---> canceling order ");
    console.log(orders[i]);
    console.log("---> removing it from shoppingbasket")
    orders.splice(i, 1);
    localStorage.setItem("shoppingBasketArray", JSON.stringify(orders));

    var main = document.querySelector("main");
    console.log("---> refreshing displayed orders")
    kill(article);
    displayNumberOfItemsInShoppingBasketWithBadge();
}
