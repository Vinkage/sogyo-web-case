/**
 * Server side code using the express framework running on a Node.js server.
 *
 * Load the express framework and create an app.
 */
const express = require('express');
const app = express();
const dbUtils = require('./mongodbFunctions.js');

/**
 * Import the dummy attractions in the database
 *
 */
dbUtils.clearMainDataBaseAndInsertDummyForTestingTheSite();

/**
 * Host all files in the client folder as static resources.
 * That means: localhost:8080/someFileName.js corresponds to client/someFileName.js.
 */
app.use(express.static('client'));

/**
 * Allow express to understand json serialization.
 */
app.use(express.json());

/**
 * A route is like a method call. It has a name, some parameters and some return value.
 *
 * Name: /api/attractions
 * Parameters: the request as made by the browser
 * Return value: the list of attractions defined above as JSON
 *
 * In addition to this, it has a HTTP method: GET, POST, PUT, DELETE
 *
 * Whenever we make a request to our server,
 * the Express framework will call one of the methods defined here.
 * These are just regular functions. You can edit, expand or rewrite the code here as needed.
 */

// main.js
app.get("/api/attractions", async function (request, response) {
    console.log("Api call received for /attractions");

    const attractions = await dbUtils.connectToDatabaseAndDo(
        (db) => {return db.collection("attractions").find().toArray()}
    );
    response.json(attractions);
});

app.post("/api/placeorder", async function (request, response) {
    console.log("Api call received for /placeorder");

    var orders = request.body;

    for (let i = 0; i < orders.length; i++) {
        orders[i] = dbUtils.giveUnique_idField(orders[i]);

        const order = orders[i];
        await dbUtils.connectToDatabaseAndDo(
            async (db) => {
                const attractions = db.collection("attractions");
                const attraction = await attractions.findOne({name: order.name});
                const currentOrders = attraction.orders;

                console.log("available after order: " + (attraction.available - order.numberOfKids - order.numberOfAdults))

                if (!currentOrders) {
                    attractions.updateOne(
                        {name: order.name},
                        {
                            $set: {orders: [order._id], available: (attraction.available - order.numberOfKids - order.numberOfAdults)}
                        }
                    )
                } else {
                    attractions.updateOne(
                        {name: order.name},
                        {
                            $set: {orders: currentOrders.push(order._id), available: (attraction.available - order.numberOfKids - order.numberOfAdults)}
                        }
                    )
                }
            }
        );
    }

    await dbUtils.connectToDatabaseAndDo(db => {return db.collection("orders").insertMany(orders)});
    response.sendStatus(200);
});

app.get("/api/myorders", function (request, response) {
    console.log("Api call received for /myorders");

    response.sendStatus(200);
});

app.get("/api/admin/edit", function (request, response) {
    console.log("Api call received for /admin/edit");

    response.sendStatus(200);
});



/**
 * Make our webserver available on port 8000.
 * Visit localhost:8000 in any browser to see your site!
 */
app.listen(8000, () => console.log('Example app listening on port 8000!'));
