//https://attacomsian.com/blog/nodejs-mongodb-local-connection
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = 'mongodb://127.0.0.1:27017';

module.exports = {
    connectToDatabaseAndDo: connectToDatabaseAndDo,
    clearMainDataBaseAndInsertDummyForTestingTheSite: clearMainDataBaseAndInsertDummyForTestingTheSite,
    giveUnique_idField: giveUnique_idField,
    addOrderToAttraction: addOrderToAttraction,
}

function connectToDatabaseAndDo(func, dbName='webcasedatabase') {
    return MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((client) => {return client.db(dbName)})
        .then(func)
        .catch(rejected => {console.log(rejected)});
}


function addOrderToAttraction(db) {
    const attractions = db.collection("attractions");
    const attraction = attractions.findOne({name: order.name});
    const currentOrders = attraction.orders;
    if (!currentOrders) {
        attractions.updateOne(
            {name: order.name},
            {
                $set: {orders: [order._id]}
            }
        )
    } else {
        attractions.updateOne(
            {name: order.name},
            {
                $set: {orders: currentOrders.push(order._id)}
            }
        )
    }
}

function giveUnique_idField(obj) {
    obj._id = ObjectId();
    return obj;
}

function giveUnique_customerField(obj) {
    obj.customer = ObjectId();
    return obj;
}


function clearMainDataBaseAndInsertDummyForTestingTheSite() {
    const attractions = [
        {
            name: "De Efteling",
            description: "The Dutch fairy tale themed park. In high demand!",
            adultPrice: 32,
            kidsPrice: 32,
            minimumNumberOfAdults: 2,
            minimumNumberOfKids: 1,
            discount: 15,
            available: 1,
            location: { lat: 51.649718, lon: 5.043689 },
        },

        {
            name: "Madurodam",
            description: "The Netherlands smallest theme park.",
            adultPrice: 25,
            kidsPrice: 20,
            minimumNumberOfAdults: 1,
            minimumNumberOfKids: 2,
            discount: 25,
            available: 5,
            location: { lat: 52.0994779, lon: 4.299619900000039 },
        },

        {
            name: "Toverland",
            description: "Experience magic and wonder.",
            adultPrice: 30,
            kidsPrice: 30,
            minimumNumberOfAdults: 2,
            minimumNumberOfKids: 2,
            discount: 33,
            available: 3,
            location: { lat: 51.3968994, lon: 5.9825161 },
        },

        {
            name: "Walibi Holland",
            description: "Need an Adrenaline Rush?",
            adultPrice: 37,
            kidsPrice: 37,
            minimumNumberOfAdults: 4,
            minimumNumberOfKids: 0,
            discount: 10,
            available: 20,
            location: { lat: 52.438554, lon: 5.766986 },
        },

        {
            name: "Duinrell",
            description: "From the Kikkerbaan to the Tikibad.",
            adultPrice: 22,
            kidsPrice: 19,
            minimumNumberOfAdults: 1,
            minimumNumberOfKids: 3,
            discount: 7,
            available: 20,
            location: { lat: 52.147433, lon: 4.383922 },
        },

        {
            name: "Slagharen",
            description: "Fun for the whole family in a true western style.",
            adultPrice: 28,
            kidsPrice: 20,
            minimumNumberOfAdults: 2,
            minimumNumberOfKids: 2,
            discount: 50,
            available: 2,
            location: { lat: 52.6249522, lon: 6.563149500000009 },
        },

        {
            name: "Drievliet",
            description: "Come and experience our wonderful attractions.",
            adultPrice: 26,
            kidsPrice: 24,
            minimumNumberOfAdults: 1,
            minimumNumberOfKids: 2,
            discount: 25,
            available: 0,
            location: { lat: 52.052608, lon: 4.352633 },
        },
    ]

    connectToDatabaseAndDo((db) => {
        db.dropDatabase();
        const collection = db.collection("attractions");
        const count = collection.countDocuments();
        count
            .then((documents) => {
                    if (documents == 0) {
                        db.collection("attractions").insertMany(attractions, (err, res) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log("clear database and inserted dummy attraction data");
                    });
                    }
            });

    });
}

