# Description

## Placing orders in shopping basket using localStorage, and then saving order in database

What happens here is that first ground truth attraction is fetched from the
database to be displayed in the dom. When the user tries to input a number of tickets the button is checked against the ground truth (and the localStorage) to see whether tickets are available, otherwise the button is disabled and greyed out.

When a valid order is placed, it is stored in the shoppingbasket or an array in the localStorage. This array of orders is displayed when the user visits the shoppingbasket page, where the user can also dynamically remove an order before paying. In this prototype the actual payment is not implemented, we assume a valid payment and the order is stored in the database. Orders in the database are displayed when visiting the my orders page.

![localStorage order](readmeMedia/localStorage.gif)

## Responsive design using CSS mediaquery breakpoints

Depending on the size of the screen of your device, if there are articles on the screen, the styling will try to display a proper number of columns of articles/attraction on the screen. The use of flexboxes was also necessary for menu boxes.

![responsive design](readmeMedia/responsiveDesign.gif)

## Ordering tickets from a map

There is also a map that uses GPS-coordinates of attractions in the database to display a marker that can be clicked to order tickets for the attraction in the same way as normal.

![ordering from the map](readmeMedia/orderingFromMap.gif)

