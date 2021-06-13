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
    return function givenTheParent(parent) {
        console.log("removing children of ")
        console.log(parent)
        function removeParentsChildren(child) {
            if (child === null) return;
            else if (func(child)) {
                const next = child.nextSibling;
                parent.removeChild(child);
                return removeParentsChildren(next);
            } else {
                return removeParentsChildren(child.nextSibling);
            }
        }
        removeParentsChildren(parent.firstChild)
    }
}

export function getUserGeoLocation() {
    if (navigator.geolocation) console.log("browser supports geolocation")

    const getCoords = async () => {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
          long: pos.coords.longitude,
          lat: pos.coords.latitude,
        };
    };

    return getCoords();
}

export function distanceToUser(userLocation) {
    return function calculateDistanceBasedOnLatLon(lat, lon) {
        const R = 6371e3; // metres
        const phi1 = userLocation.lat * Math.PI/180; // φ, λ in radians
        const phi2 = lat * Math.PI/180;
        const diffPhi = (lat-userLocation.lat) * Math.PI/180;
        const diffLambda = (lon-userLocation.long) * Math.PI/180;

        const a = Math.sin(diffPhi/2) * Math.sin(diffPhi/2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(diffLambda/2) * Math.sin(diffLambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const d = R * c; // in metres
        return d;
    }
}

export function bubbleSort(array, key, compare) {
    const sorted = [...array];
    console.log("original: " + array);
    console.log("copy: " + sorted);

    var tmp;
    for (let i = 0; i < array.length; i++) {
        for (let j = 1; j < array.length - i; j++) {

            if (compare(key(sorted[j - 1]), key(sorted[j]))) {
                tmp = sorted[j];
                sorted[j] = sorted[j-1];
                sorted[j - 1] = tmp;
            }


        }
    }
    return sorted;
}
