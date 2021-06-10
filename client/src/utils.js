// client/src/function.js
export async function fetchOrders() {

    try {

        const response = await fetch("api/myorders");

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const orders = await response.json();
        return orders;


    } catch(error) {
        console.log("something went wrong when fetching orders: ", error);
    }

}

export async function fetchAttractions() {

    try {

        const response = await fetch("api/attractions");

        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }

        const attractions = await response.json();
        return attractions;


    } catch(error) {
        console.log("something went wrong when fetching attractions: ", error);
    }

}

export function readOrderArrayFromLocalStorage() {
    var orders = JSON.parse(localStorage.getItem("shoppingBasketArray"));
    return orders;
}


export function displayNumberOfItemsInShoppingBasketWithBadge() {
    var shoppingBasketArray = JSON.parse(localStorage.getItem("shoppingBasketArray"));
    if (shoppingBasketArray === null) {
        document.querySelector(".badge").innerText = 0;
    } else {
        document.querySelector(".badge").innerText = shoppingBasketArray.length;
    }
}

export function dutchCurrencyFormat(number) {
    var decimal = (number * 10) % 10
    if (decimal === 0) return number + ",-";
    else {
        return (number * 10 - decimal) / 10 + "," + decimal;
    }
}

export function dutchCurrencyFormatWithSign(number) {
    return "\u20AC" + dutchCurrencyFormat(number);
}


export function findParent(func) {
    return function startingFromThisNode(node) {
        if (func(node)) {
            return node;
        } else {
            return startingFromThisNode(node.parentNode);
        }
    }
}

export function kill(node) {
    node.parentNode.removeChild(node);
}

export function killChildren(func) {
    return function startingFromThisChildNode(node) {
    }
}

