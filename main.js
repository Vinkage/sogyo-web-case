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
        const order = orders[i];
        await dbUtils.connectToDatabaseAndDo(
            async (db) => {
                const attractions = db.collection("attractions");
                const attraction = await attractions.findOne({name: order.name});

                // const availableAfterOrder = -1;
                const availableAfterOrder = (attraction.available - order.numberOfKids - order.numberOfAdults);
                if (availableAfterOrder < 0) {
                    response.sendStatus(403);
                    return;
                }

            }
        );
    }

    if (response.statusCode === 200) {
        console.log("---> valid order status so far is " + response.statusCode + ", adding to database");
        for (let i = 0; i < orders.length; i++) {
            orders[i] = dbUtils.giveUnique_idField(orders[i]);

            const order = orders[i];
            await dbUtils.connectToDatabaseAndDo(
                async (db) => {
                    const attractions = db.collection("attractions");
                    const attraction = await attractions.findOne({name: order.name});
                    const currentOrders = attraction.orders;

                    const availableAfterOrder = (attraction.available - order.numberOfKids - order.numberOfAdults);
                    console.log("available after order: " + availableAfterOrder)

                    if (!currentOrders) {
                        attractions.updateOne(
                            {name: order.name},
                            {
                                $set: {orders: [order._id], available: availableAfterOrder}
                            }
                        )
                    } else {
                        attractions.updateOne(
                            {name: order.name},
                            {
                                $set: {orders: currentOrders.push(order._id), available: availableAfterOrder}
                            }
                        )
                    }
                }
            );
        }


        await dbUtils.connectToDatabaseAndDo(db => {return db.collection("orders").insertMany(orders)});
        response.sendStatus(200);
    } else {
        console.log("---> invalid order status so far is " + response.statusCode)
    }

});

app.get("/api/myorders", async function (request, response) {
    console.log("Api call received for /myorders");
    const orders = await dbUtils.connectToDatabaseAndDo(
        db => {return db.collection("orders").find().toArray()}
    );

    response.json(orders);
});

app.post("/api/admin/edit", function (request, response) {
    console.log("Api call received for /admin/edit");

    const name = request.body.name;
    const field = request.body.field;
    const value = request.body.value;

    const updateObject = {};
    updateObject[field] = value

    if (value >= 0) {
        dbUtils.connectToDatabaseAndDo(
            db => {
                const attractions = db.collection("attractions");
                attractions.updateOne(
                    {name: name},
                    {
                        $set: updateObject
                    }
                )

            }
        )
    } else {
        response.sendStatus(403);
        return;
    }

    response.sendStatus(200);
});

app.post("/api/admin/delete", function (request, response) {
    console.log("Api call received for /admin/delete");

    const name = request.body.name;

    dbUtils.connectToDatabaseAndDo(
        db => {
            const attractions = db.collection("attractions");
            attractions.deleteOne({name: name});
        }
    );

    response.sendStatus(200);
});

app.post("/api/admin/add", function (request, response) {
    console.log("Api call received for /admin/add");

    const name = request.body.name;
    const description = request.body.description;
    const lat = request.body.lat;
    const lon = request.body.long;

    const attraction = {
        name: name,
        description: description,
        adultPrice: 0,
        kidsPrice: 0,
        minimumNumberOfAdults: 0,
        minimumNumberOfKids: 0,
        discount: 0,
        available: 0,
        location: {
            lat: lat,
            lon: lon,
        }
    }

    dbUtils.connectToDatabaseAndDo(
        db => {
            const attractions = db.collection("attractions");
            attractions.insertOne(attraction);
        }
    );



    response.json(attraction);
});


/**
 * Make our webserver available on port 8000.
 * Visit localhost:8000 in any browser to see your site!
 */
app.listen(8000, () => console.log('Example app listening on port 8000!'));
