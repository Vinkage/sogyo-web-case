document.querySelector(".badge").innerText = localStorage.length;

function getOrderArray() {
    var orders = new Array;
    for (let i = 0; i < localStorage.length; i++) {
        var order = localStorage.getItem(i+1);
        order = JSON.parse(order);
        orders.push(order);
    }
    // console.log(orders);
    return orders;
}

class Order {
    constructor(orderJSON) {
        for (const [key, value] of Object.entries(orderJSON)) {
            this[key] = value;
        }

    }

    addToMain() {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
        var main = document.querySelector("main");
        var template = document.querySelector("#ticket");

        var clone = template.content.cloneNode(true);
        // console.log(clone);
        var lines = clone.querySelectorAll("div");

        for (var i = 0; i < lines.length; i++) {
            var text = lines[i].textContent;

            if (text === "Parkname") {
                console.log(this.name);
                lines[i].textContent = this.name;
            }

            if (text.toLowerCase().includes("adults")) {
                lines[i].textContent = text + " " + this.adults;
            }

            if (text.toLowerCase().includes("kids")) {
                lines[i].textContent = text + " " + this.children;
            }
        }

        main.appendChild(clone);
    }
}


function displayOrders() {
    var orders = getOrderArray();
    for (let i = 0; i < orders.length; i++) {
        orderObj = new Order(orders[i]);
        orderObj.addToMain();
    }

}

displayOrders();

function finalizePayment(event) {
    console.log("finalizing payments");
    localStorage.clear();
    window.location.replace("orderplaced.html");
}

document.querySelector("#finalizepaymentbutton").addEventListener("click", finalizePayment);
