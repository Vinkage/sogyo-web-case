import { dutchCurrencyFormat, dutchCurrencyFormatWithSign } from "./utils.js"
import { fetchAttractions } from "./functions.js"
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


export class Order extends TemplatedNode {

    addToNode(node, orderFunctionality) {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template

        var clone = this.template.content.cloneNode(true);
        // console.log(clone);
        clone.querySelector(".parkname").textContent = this.name;
        clone.querySelector(".numberofkids").textContent = "Kids: " + this.numberOfKids;
        clone.querySelector(".numberofadults").textContent = "Adults: " + this.numberOfAdults;


        var priceString = "Total: " + dutchCurrencyFormat(this.price.total);
        if (this.price.discount) {
            priceString = priceString + " discount: " + dutchCurrencyFormatWithSign(this.price.discount);
        }
        clone.querySelector(".price").textContent = priceString;

        clone.querySelector("button").addEventListener("click", orderFunctionality.cancel);

        node.appendChild(clone);
    }

}

export class ParkArticle extends TemplatedNode {

    addToNode(node, parkArticleFunctionality) {
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
        parkArticleFunctionality.disableButton(this.name, button)(null);

        var inputElements = clone.querySelectorAll("input");
        for (let i = 0; i < inputElements.length; i++) {
            inputElements[i].addEventListener("input", parkArticleFunctionality.displayTotal);
            inputElements[i].addEventListener("input", parkArticleFunctionality.disableButton(this.name, button));
        }
        node.appendChild(clone);
    }
}
