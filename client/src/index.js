function orderButtonClicked(event) {
    console.log("button click");
    var button;
    if (event.target.classList.contains("orderbutton")) {
        button = event.target;
    } else {
        button = event.target.parentNode;
    }
    var node = button.previousElementSibling;
    var adults;
    var kids;
    var parkName;
    while (true) {
        if (node.classList.contains("numberofkids")) {
            kids = Number(node.value);
        }
        if (node.classList.contains("numberofadults")) {
            adults = Number(node.value)
        }
        if (node.classList.contains("parkname")) {
            parkName = node.innerText;
            break
        }
        if (node.previousElementSibling == null) {
            node = node.parentNode;
        } else {
            node = node.previousElementSibling;
        }
    }

    if (kids > 0 || adults > 0) {
        saveOrderInShoppingBasket(parkName, adults, kids);
    }
};

function saveOrderInShoppingBasket(name, adults, kids) {
    var order = {
        name: name,
        adults: adults,
        children: kids,
    };
    var orderString = JSON.stringify(order);
    localStorage.setItem(localStorage.length + 1, orderString)
    document.querySelector(".badge").innerText = localStorage.length;
}

document.querySelector(".badge").innerText = localStorage.length;
var buttons = document.querySelectorAll(".orderbutton");


for (var i = 0; i < buttons.length; i++) {
    console.log(buttons[i]);
    buttons[i].addEventListener("click", orderButtonClicked);
}


// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("sticky-header");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}


