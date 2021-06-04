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


export function findParentWithTag(tagName) {
    if (this.tagName === tagName.toUpperCase()) {
        return this;
    } else {
        return findParentWithTag.bind(this.parentNode)(tagName);
    }
}

export function childKillerUsingTags(parent) {

    return function oneOfMyChildren(child) {

        return function killChildrenWithTag(tag) {
            if (child === null) {
                return
            } else if (child.tagName === tag.toUpperCase()) {
                var next = child.nextSibling;
                parent.removeChild(child);
                return oneOfMyChildren(next)(tag);
            } else {
                return oneOfMyChildren(child.nextSibling)(tag);
            }
        }

    }
}
