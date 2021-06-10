import {
    dutchCurrencyFormat,
    dutchCurrencyFormatWithSign,
} from "./utils.js"

import {
    disableButton,
    calulateTotal,
    checkTicketAvailability,
    displayTotal
} from "./attractionArticle.js"

import {
    cancelOrder
} from "./orderArticle.js"

import {
    updateAttractionInDatabase,
    deleteAttractionInDatabase
} from "./adminArticle.js"

/**
 * Abstract class
 *
 *
 * @class TemplatedNode
 */
class TemplatedNode {
    constructor(json, template) {
        // console.log(json);
        for (const [key, value] of Object.entries(json)) {
            this[key] = value;
        }

        this.template = template;
    }

    addToNode(node) {
        throw new Error("Method 'addToNode' node be implemented.");
    }
}

export class AdminAttraction extends TemplatedNode {
    addToNode(node) {
        var clone = this.template.content.cloneNode(true);
        clone.querySelector(".parkname").textContent = this.name;

        clone.querySelector(".adultprice").querySelector(".adultPrice").value = this.adultPrice;
        clone.querySelector(".kidsprice").querySelector(".kidsPrice").value = this.kidsPrice;

        clone.querySelector(".discountrequirement").querySelector(".minimumNumberOfAdults").value = this.minimumNumberOfAdults;
        clone.querySelector(".discountrequirement").querySelector(".minimumNumberOfKids").value = this.minimumNumberOfKids;
        clone.querySelector(".discountrequirement").querySelector(".discount").value = this.discount;

        clone.querySelector(".availabletickets").querySelector(".available").value = this.available;

        const inputElements = clone.querySelectorAll("input");
        for (let i = 0; i < inputElements.length; i++) {
            const input = inputElements[i];
            const fieldToUpdate = input.className;
            input.addEventListener("input", updateAttractionInDatabase(this.name, fieldToUpdate));
        }

        const deletebutton = clone.querySelector("#deletebutton");
        deletebutton.addEventListener("click", deleteAttractionInDatabase(this.name));

        node.appendChild(clone);
    }
}


export class Order extends TemplatedNode {

    addToNode(node) {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

        var clone = this.template.content.cloneNode(true);
        // console.log(clone);
        clone.querySelector(".parkname").textContent = this.name;
        clone.querySelector(".numberofkids").textContent = "Kids: " + this.numberOfKids;
        clone.querySelector(".numberofadults").textContent = "Adults: " + this.numberOfAdults;


        var priceString = "Total: " + dutchCurrencyFormatWithSign(this.price.total);
        if (this.price.discount) {
            priceString = priceString + " discount: " + dutchCurrencyFormatWithSign(this.price.discount);
        }
        clone.querySelector(".price").textContent = priceString;

        var button = clone.querySelector("button");

        if (button) button.addEventListener("click", cancelOrder);

        node.appendChild(clone);
    }

}

export class ParkArticle extends TemplatedNode {

    addToNode(node) {
        const clone = this.cloneTemplateAndFillInHTML();
        node.appendChild(clone);
    }

    toHTML() {
        return this.cloneTemplateAndFillInHTML();

    }

    cloneTemplateAndFillInHTML() {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

        var clone = this.template.content.cloneNode(true);
        this.clone = clone;
        var cloneChildren = clone.querySelectorAll("div");

        for (var i = 0; i < cloneChildren.length; i++) {
            // console.log(cloneChildren[i].className);
            var element = cloneChildren[i];
            var className = element.className;
            var text = element.textContent;
            if (className === "parkname") {
                element.textContent = this.name;
            }

            if (className === "parkdescription") {
                element.textContent = this.description;
            }

            if (className === "adultprice") {
                element.querySelector(".price").textContent = dutchCurrencyFormat(this.adultPrice);
            }

            if (className === "kidsprice") {
                element.querySelector(".price").textContent = dutchCurrencyFormat(this.kidsPrice);
            }

            if (className === "discountrequirement") {
                element.querySelector(".adults").textContent = this.minimumNumberOfAdults;
                element.querySelector(".child").textContent = this.minimumNumberOfKids;
            }
        }

        var button = clone.querySelector(".orderbutton");
        disableButton(this.name, button)(null);

        var inputElements = clone.querySelectorAll("input");
        for (let i = 0; i < inputElements.length; i++) {
            inputElements[i].addEventListener("input", displayTotal);
            inputElements[i].addEventListener("input", disableButton(this.name, button));
        }
        return clone;
    }
}
